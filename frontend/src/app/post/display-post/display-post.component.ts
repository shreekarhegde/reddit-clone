import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material';
import { TokenService } from '../../services/token.service';
import { UserDetailsService } from '../../services/user-details.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DataService } from 'src/app/services/data-service.service';
import * as momemt from 'moment';

@Component({
  selector: 'app-display-post',
  templateUrl: './display-post.component.html',
  styleUrls: ['./display-post.component.css']
})
export class DisplayPostComponent implements OnInit {
  public postsUrl: string = 'http://localhost:3030/posts';
  public commentsUrl: string = 'http://localhost:3030/comments';
  public userID: any = '';
  public accessToken: string = '';
  public headerParams: object = {};
  public posts: object[] = [];
  public comments: object[] = [];
  public username: string = '';
  public showSpinner: boolean = true;
  public user: any = {};
  @Input() subscribedCommunityID: string = '';

  constructor(
    public http: HttpService,
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public snackbar: MatSnackBar,
    public dataService: DataService
  ) {}

  async ngOnInit() {
    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    this.userDetailsService
      .getUserID()
      .then(res => {
        this.userID = res;
      })
      .catch(err => {
        this.showErrorNotification(err, 'userID was not recevied');
      });

    this.userDetailsService
      .getUserProfile()
      .then(res => {
        this.user = res;
      })
      .catch(err => {
        this.showErrorNotification(err, 'user was not recevied: display-post');
      });

    this.dataService.subscribedCommunity$.subscribe(id => {
      if (id) {
        console.log('latest subscribed community id===========>', id);
        this.http.getRequest(`${this.postsUrl}/?communityID=${id}&$populate=userID&$populate=communityID`, this.headerParams).subscribe(
          res => {
            console.log('new posts=========>', res);
            this.posts = this.posts.concat(res['data']);
            res['data'].forEach(post => {
              this.getComments(post);
            });
          },
          err => {
            this.showErrorNotification(err, 'id was not recevied in watcher');
          }
        );
      }
    });

    let populateQuery = '/?$populate=userID&$populate=communityID';

    this.http.getRequest(this.postsUrl + populateQuery, this.headerParams).subscribe(
      res => {
        if (res.hasOwnProperty('data')) {
          console.log('ngOnInit: posts----->', res);
          let allPosts = res['data'];

          //check for creator of posts and enable delete button only if true.
          allPosts.forEach(post => {
            if (this.userID === post['userID']['_id']) {
              post['creator'] = true;
            } else {
              post['creator'] = false;
            }

            if (this.user) {
              //show posts only from subscribed communities
              let index = this.user['communities'].findIndex(community => community['_id'] === post['communityID']['_id']);
              if (index > -1 && !this.posts.includes(post)) {
                let time = momemt(post['createdAt']).fromNow();
                post['createdTimeIntermsOfHours'] = time;
                this.posts.push(post);
                this.getComments(post);
              }
            }
          });
        }
      },
      err => {
        this.showErrorNotification(err, 'posts was not recevied');
      }
    );
  }

  upvote(id) {
    let index = this.posts.findIndex(post => post['_id'] === id);
    // console.log('index-------------->', index);
    if (!this.posts[index]['upvotedBy'].includes(this.userID) && id) {
      let voteUrl = 'http://localhost:3030/votes';
      let query = `?text=upvote&postID=${id}&userID=${this.userID}`;

      this.http.patchRequest(voteUrl + query, null, this.headerParams).subscribe(
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
          console.log(err);
        }
      );
    }
  }
  downvote(id) {
    let index = this.posts.findIndex(post => post['_id'] === id);
    if (!this.posts[index]['downvotedBy'].includes(this.userID) && id) {
      let voteUrl = 'http://localhost:3030/votes';
      let query = `?text=downvote&postID=${id}&userID=${this.userID}`;

      this.http.patchRequest(voteUrl + query, null, this.headerParams).subscribe(
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
          console.log(err);
        }
      );
    }
  }

  deletePost(postID) {
    // console.log(postID);
    this.http.deleteRequest(`${this.postsUrl}/${postID}`, this.headerParams).subscribe(
      res => {
        let index = this.posts.findIndex(post => post['_id'] === res['_id']);
        this.posts.splice(index, 1);
        this.snackbar.open('post was deleted successfully', 'OK', {
          duration: 1500,
          verticalPosition: 'top',
          panelClass: 'login-snackbar'
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  getComments(post) {
    post['comments'] = [];

    let postQuery = '/?postID=' + post['_id'];

    this.http.getRequest(this.commentsUrl + postQuery, this.headerParams).subscribe(
      res => {
        if (res.hasOwnProperty('data')) {
          // console.log('all comments------->', res);
          post['comments'] = res['data'];
        }
      },
      err => {
        // console.log(err);
        // const snackbarRef = this.snackbar.open('something went wrong', '', {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass: 'login-snackbar'
        // });
        this.showErrorNotification(err, 'comments was not recevied');
      }
    );
  }

  showErrorNotification(err, message) {
    console.log(err);
    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'login-snackbar'
    });
  }
}
