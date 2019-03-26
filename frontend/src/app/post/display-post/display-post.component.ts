import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material';
import { TokenService } from '../../services/token.service';
import { UserDetailsService } from '../../services/user-details.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DataService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-display-post',
  templateUrl: './display-post.component.html',
  styleUrls: ['./display-post.component.css']
})
export class DisplayPostComponent implements OnInit {
  public postsUrl: string = 'http://localhost:3030/posts';
  public commentsUrl: string = 'http://localhost:3030/comments';
  public query: string = '';
  public userID: string = '';
  public accessToken: string = '';
  public headerParams: object = {};
  public posts: object[] = [];
  public comments: object[] = [];
  public username: string = '';
  public showSpinner: boolean = true;
  public subscribedCommunityID: string = '';

  constructor(
    public http: HttpService,
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public snackbar: MatSnackBar,
    public dataService: DataService
  ) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();

    this.query = '?$populate=userID&$populate=communityID';

    this.userID = await this.userDetailsService.getUserID();

    this.dataService.subscribedCommunity.subscribe(subscribedCommunityID => {
      this.subscribedCommunityID = subscribedCommunityID;
    });

    let communityQuery = `?communityID=${this.subscribedCommunityID}`;

    let postsFromSubscribedCommunity = this.http.getRequest(this.postsUrl + communityQuery, this.headerParams);

    postsFromSubscribedCommunity.subscribe(
      posts => {
        console.log('postsFromSubscribedCommunity=========', posts);
      },
      err => {
        console.log(err);
      }
    );

    this.http.getRequest(this.postsUrl + this.query, this.headerParams).subscribe(
      posts => {
        if (posts.hasOwnProperty('data')) {
          console.log('ngOnInit: posts----->', posts);
          this.posts = posts['data'];
          this.posts.forEach(post => {
            //check for creator of posts and enable delete button only if true.
            if (this.userID === post['userID']['_id']) {
              post['creator'] = true;
            } else {
              post['creator'] = false;
            }

            console.log('post: display post------>', post);
            post['comments'] = [];
            let postQuery = '/?postID=' + post['_id'];
            console.log(postQuery);
            this.http.getRequest(this.commentsUrl + postQuery, this.headerParams).subscribe(
              res => {
                if (res.hasOwnProperty('data')) {
                  console.log('all comments------->', res);
                  post['comments'] = res['data'];
                }
              },
              err => {
                console.log(err);
                const snackbarRef = this.snackbar.open('something went wrong', '', {
                  duration: 2000,
                  verticalPosition: 'top',
                  panelClass: 'login-snackbar'
                });
              }
            );
          });
        }
      },
      err => {
        console.log('ngOnInit: err--->', err);
      }
    );

    //TODO
    //unsubscribe at ngOnDestroy
    //posts only from subscribed community
    let communities = await this.userDetailsService.getUserProfile();
    console.log('==========', communities);
  }

  upvote(id) {
    let index = this.posts.findIndex(post => post['_id'] === id);
    console.log('index-------------->', index);
    if (!this.posts[index]['upvotedBy'].includes(this.userID) && id) {
      let voteUrl = 'http://localhost:3030/votes';
      let query = `?text=upvote&postID=${id}&userID=${this.userID}`;

      this.http.patchRequest(voteUrl + query, null, this.headerParams).subscribe(
        res => {
          console.log('upvoted', res);
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
          console.log('downvoted', res);
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
    console.log(postID);
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
}
