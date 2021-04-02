import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDetailsService } from '../../services/user-details.service';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { ToggleService } from '../add-comment/toggle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

const POSTS_URL = '/api/posts';
const COMMENTS_URL = '/api/comments';
const VOTES_URL = '/api/votes';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  private bool: boolean;
  private headerParams: object = {};

  public profileName: string = '';
  public postTitle: string = '';
  public postedBy: string = '';
  public postDescription: string = '';
  public postID: string = '';
  public totalVotes: number = 0;
  public userID: any = '';
  public totalComments: number = 0;
  public isDeleted: boolean = false;
  public text: string = '';
  public newComment: object = {};
  public creator: boolean = false;
  public refreshCommentsList: boolean = false;

  constructor(
    public userDetailsService: UserDetailsService,
    public toggleService: ToggleService,
    public httpService: HttpService,
    public tokenService: TokenService,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.headerParams = this.tokenService.checkTokenAndSetHeader();
    let userID = await this.userDetailsService.getUserID();
    console.log('userID: ngOnInit: add-comment.component========>', userID);

    this.userID = userID;

    let user = await this.userDetailsService.getUserProfile();

    this.profileName = user['username'];
    console.log('username: ngOnInit: add-comment.component========>', this.profileName);

    this.activeRoute.params.subscribe(
      params => {
        this.postID = params['id'];
      },
      err => {
        console.log('add-comment: err------->', err);
      }
    );

    let query = `?$populate=userID`;

    let post = this.httpService.getRequest(`${POSTS_URL}/${this.postID}` + query, this.headerParams);

    post.subscribe(
      post => {
        console.log('add-comment: posts------->', post);
        if (post) {
          this.postedBy = post['userID']['username'];
          this.totalVotes = post['totalVotes'];
          this.postTitle = post['title'];

          if (this.userID === post['userID']['_id']) {
            this.creator = true;
          } else {
            this.creator = false;
          }

          //get no.of comments
          let postQuery = `/?postID=${post['_id']}`;
          this.httpService.getRequest(COMMENTS_URL + postQuery, this.headerParams).subscribe(
            res => {
              this.totalComments = res['data']['length'];
            },
            err => {
              this.showNotification(err, 'err', 'comments were not received');
            }
          );

          this.postDescription = post['text'];
          if (post['upvotedBy'].indexOf(this.userID) >= 0) {
            console.log('add-comment-------->upvoted true');
            //set bool to true if userID is present in upvoters array of a post
            this.bool = true;
          } else if (post['downvotedBy'].indexOf(this.userID) >= 0) {
            console.log('add-comment-------->downvoted true');
            //set bool to false if userID is present in downvoters array of a post
            this.bool = false;
          }
        }
      },
      err => {
        this.showNotification(err, 'err', 'posts were not received');
      }
    );
  }

  upvote(id) {
    //allow upvote only if bool is false
    if (id && this.bool !== true) {
      let query = `?text=upvote&postID=${id}&userID=${this.userID}`;
      this.httpService.patchRequest(VOTES_URL + query, null, this.headerParams).subscribe(
        res => {
          this.totalVotes = res['totalVotes'];
          this.bool = true;
        },
        err => {
          this.showNotification(err, 'err', 'could not upvote, please try again');
        }
      );
    }
  }

  downvote(id) {
    //allow downvote only if bool is true
    if (id && this.bool !== false) {
      let query = `?text=downvote&postID=${id}&userID=${this.userID}`;

      this.httpService.patchRequest(VOTES_URL + query, null, this.headerParams).subscribe(
        res => {
          this.totalVotes = res['totalVotes'];
          this.bool = false;
        },
        err => {
          this.showNotification(err, 'err', 'could not downvote, please try again');
        }
      );
    }
  }

  async deletePost(postID) {
    console.log('postid: add-comment ------->', postID);
    if (window.confirm('Are you sure you want to delete this?')) {
      let query = `/?postID=${postID}`;

      let comments = await this.httpService.deleteRequest(COMMENTS_URL + query, this.headerParams);
      comments.subscribe(
        res => {
          console.log('deleted comments--->', res);
        },
        err => {
          this.showNotification(err, 'err', 'could not delete associated comments to this post');
        }
      );
      this.httpService.deleteRequest(`${POSTS_URL}/${postID}`, this.headerParams).subscribe(
        res => {
          console.log('delete post: add comment: res----->', res);
          this.isDeleted = true;
          this.router.navigate(['r']);
          this.showNotification(null, 'success', 'post was deleted successfully');
        },
        err => {
          this.isDeleted = false;
          console.log('delete post: add comment: err------>', err);
        }
      );
    }
  }

  addComment() {
    let data = {
      text: this.text,
      postID: this.postID,
      userID: this.userID
    };

    this.httpService.postRequest(COMMENTS_URL, data, this.headerParams).subscribe(
      res => {
        if (res) {
          console.log('res: comment: add-comment------------>', res);
          this.newComment = res;
          this.totalComments += 1;
          this.toggleService.setToggleValue(true);
        }
      },
      err => {
        console.log('err: comment: add-comment------------>', err);
        this.showNotification(err, 'err', 'could not add comment, please try again');
      }
    );
  }

  showNotification(err, type, message) {
    console.log('err: showNotification: add-comment--------->', err);
    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }

  updateCommentsCount($event) {
    if ($event) {
      console.log($event);
      if ($event === 'comment added') {
        this.totalComments += 1;
      } else if ($event === 'comment deleted') {
        this.totalComments -= 1;
      }
    }
  }
}
