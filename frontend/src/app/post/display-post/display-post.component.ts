import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material';
import { TokenService } from '../../services/token.service';
import { UserDetailsService } from '../../services/user-details.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data-service.service';

import * as momemt from 'moment';
import { skip, filter } from 'rxjs/operators';
import { FilterService } from 'src/app/navigation/top-navigation/filter.service';

const POSTS_URL = 'http://localhost:3030/posts';
const COMMENTS_URL = 'http://localhost:3030/comments';
const VOTES_URL = 'http://localhost:3030/votes';

@Component({
  selector: 'app-display-post',
  templateUrl: './display-post.component.html',
  styleUrls: ['./display-post.component.css']
})
export class DisplayPostComponent implements OnInit {
  public userID: any = '';
  private headerParams: object = {};
  public posts: any[] = [];
  public comments: object[] = [];
  public username: string = '';
  public showSpinner: boolean = true;
  public user: any = {};
  public isStillLoading: boolean = true;
  @Input() subscribedCommunityID: string = '';

  constructor(
    public http: HttpService,
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public snackbar: MatSnackBar,
    public dataService: DataService,
    public filterService: FilterService
  ) {}

  async ngOnInit() {
    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    this.userID = await this.userDetailsService.getUserID();

    this.user = await this.userDetailsService.getUserProfile();

    this.dataService.subscribedID$.subscribe(async id => {
      if (id) {
        console.log('latest subscribed community id===========>', id);
        let posts = await this.http.getRequest(`${POSTS_URL}/?communityID=${id}&$populate=userID&$populate=communityID`, this.headerParams);
        posts.subscribe(
          res => {
            console.log('new posts=========>', res);
            this.posts = this.posts.concat(res['data']);
            res['data'].forEach(post => {
              this.getComments(post);
            });
          },
          err => {
            this.showNotification(err, 'err', 'id was not recevied in watcher');
          }
        );
      }
    });

    this.filterService.filterValue$.pipe(skip(1)).subscribe(
      async filter => {
        console.log('filter--------->', filter);
        if (filter === 'Recent') {
          let query = `?$populate=userID&$populate=communityID&$sort[createdAt]=-1`;
          this.getPosts(query);
        } else if (filter === 'Old') {
          let query = `?$populate=userID&$populate=communityID&$sort[createdAt]= 1`;
          this.getPosts(query);
        } else if (filter === 'Hot' || filter === 'Popular' || filter === 'Controversial' || filter === 'Best') {
          let query = `/?filter=${filter}`;
          this.getPosts(query);
        }
      },
      err => {
        this.showNotification(err, 'err', 'filter was not recevied');
      }
    );

    let populateQuery = '/?$populate=userID&$populate=communityID';

    this.getPosts(populateQuery);

    setTimeout(() => {
      this.isStillLoading = false;
    }, 4000);
  }

  upvote(id) {
    let index = this.posts.findIndex(post => post['_id'] === id);
    // console.log('index-------------->', index);
    if (!this.posts[index]['upvotedBy'].includes(this.userID) && id) {
      let query = `?text=upvote&postID=${id}&userID=${this.userID}`;

      this.http.patchRequest(VOTES_URL + query, null, this.headerParams).subscribe(
        res => {
          // console.log('upvoted', res);
          let index = this.posts.findIndex(post => post['_id'] == id);
          console.log('index of upvoted post---------->', index);
          this.posts[index]['totalVotes'] = res['totalVotes'];
          //if user is not present in upvoters array push him on the fly. Nothing do with db.
          this.posts[index]['upvotedBy'].push(this.userID);
          this.posts[index]['downvotedBy'].pop(this.userID);
        },
        err => {
          this.showNotification(err, 'err', 'could not upvote');
        }
      );
    }
  }

  downvote(id) {
    let index = this.posts.findIndex(post => post['_id'] === id);
    if (!this.posts[index]['downvotedBy'].includes(this.userID) && id) {
      let query = `?text=downvote&postID=${id}&userID=${this.userID}`;

      this.http.patchRequest(VOTES_URL + query, null, this.headerParams).subscribe(
        res => {
          // console.log('downvoted', res);
          let index = this.posts.findIndex(post => post['_id'] == id);
          console.log('index of downvoted post---------->', index);
          this.posts[index]['totalVotes'] = res['totalVotes'];
          //if user is not present in downvoters array push him on the fly. Nothing do with db.
          this.posts[index]['downvotedBy'].push(this.userID);
          this.posts[index]['upvotedBy'].pop(this.userID);
        },
        err => {
          this.showNotification(err, 'err', 'could not downvote');
        }
      );
    }
  }

  async deletePost(postID) {
    // console.log(postID);
    let query = `/?postID=${postID}`;
    if (window.confirm('Are you sure you want to delete this?')) {
      let comments = await this.http.deleteRequest(COMMENTS_URL + query, this.headerParams);
      comments.subscribe(
        res => {
          console.log('deleted comments--->', res);
          let index = this.posts.findIndex(post => post['_id'] == postID);
          this.posts[index]['comments'] = [];
        },
        err => {
          this.showNotification(err, 'err', 'could not delete associated comments to this post');
        }
      );

      let posts = await this.http.deleteRequest(`${POSTS_URL}/${postID}`, this.headerParams);
      posts.subscribe(
        res => {
          let index = this.posts.findIndex(post => post['_id'] === res['_id']);
          this.posts.splice(index, 1);
          this.showNotification(null, 'success', 'deleted post successfully');
        },
        err => {
          this.showNotification(err, 'err', 'could not delete post');
        }
      );
    }
  }

  getComments(post) {
    post['comments'] = [];
    console.log('post: getComments: display-post--------->', post);
    let postQuery = '/?postID=' + post['_id'];

    this.http.getRequest(COMMENTS_URL + postQuery, this.headerParams).subscribe(
      res => {
        if (res.hasOwnProperty('data')) {
          console.log('all comments------->', res);
          post['comments'] = res['data'];
        }
      },
      err => {
        this.showNotification(err, 'err', 'comments was not recevied');
      }
    );
  }

  checkPostForCreatorAndSubscribedCommunity(post) {
    if (this.userID === post['userID']['_id']) {
      post['creator'] = true;
    } else {
      post['creator'] = false;
    }

    if (this.user.hasOwnProperty('communities')) {
      //show posts only from subscribed communities
      let index = this.user['communities'].findIndex(community => community['_id'] === post['communityID']['_id']);
      if (index > -1 && !this.posts.includes(post)) {
        console.log('before assigning time', post);
        if (post.hasOwnProperty('createdAt')) {
          let time = momemt(post['createdAt']).fromNow();
          post['createdTimeIntermsOfHours'] = time;
          this.posts.push(post);
          this.getComments(post);
        }
      }
    }
  }

  async getPosts(query) {
    this.posts = [];

    let posts = await this.http.getRequest(POSTS_URL + query, this.headerParams);
    posts.subscribe(
      res => {
        console.log('ngOnInit: posts: getPosts----->', res);

        if (res.hasOwnProperty('data')) {
          console.log('ngOnInit: posts----->', res);
          let allPosts = res['data'];
          this.isStillLoading = false;
          //check for creator of posts and enable delete button only if true.
          allPosts.forEach(post => {
            this.checkPostForCreatorAndSubscribedCommunity(post);
          });
        } else if (Array.isArray(res)) {
          res.forEach(filterdPost => {
            console.log(filterdPost);
            this.checkPostForCreatorAndSubscribedCommunity(filterdPost);
          });
        }
      },
      err => {
        this.showNotification(err, 'err', 'posts was not recevied');
      }
    );
  }

  showNotification(err, type, message) {
    console.log(err);

    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }
}
