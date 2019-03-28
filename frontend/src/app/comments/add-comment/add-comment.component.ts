import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDetailsService } from '../../services/user-details.service';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { ToggleService } from '../add-comment/toggle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  public bool: boolean;
  public usersUrl: string = 'http://localhost:3030/users';
  public postsUrl: string = 'http://localhost:3030/posts';
  public commentsUrl: string = 'http://localhost:3030/comments';
  public profileName: string = '';
  public postTitle: string = '';
  public postedBy: string = '';
  public postDescription: string = '';
  public headerParams: object = {};
  public postID: string = '';
  public totalVotes: number = 0;
  public userID: any = '';
  public totalComments: number = 0;
  public isDeleted: boolean = false;
  public text: string = '';
  public parentCommentID: string = '';
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
    // this.userID = await this.userDetailsService.getUserID();
    console.log('userID: ngOnInit: add-comment.component========>', this.userDetailsService.getUserID());

    this.userDetailsService
      .getUserID()
      .then(res => {
        this.userID = res;
      })
      .catch(err => {
        this.showErrorNotification(err, 'userID was not recevied: add-comment.component');
      });

    this.userDetailsService
      .getUserProfile()
      .then(user => {
        console.log('user: addComment------>', user);
        if (user.hasOwnProperty('username')) {
          this.profileName = user['username'];
        }
      })
      .catch(err => {
        console.log(err);
      });

    this.activeRoute.params.subscribe(
      params => {
        this.postID = params['id'];
      },
      err => {
        console.log('add-comment: err------->', err);
      }
    );

    let query = `?$populate=userID`;

    this.httpService.getRequest(`${this.postsUrl}/${this.postID}` + query, this.headerParams).subscribe(
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
          this.httpService.getRequest(this.commentsUrl + postQuery, this.headerParams).subscribe(
            res => {
              this.totalComments = res['data']['length'];
            },
            err => {
              console.log('err: ngOnInit: add-comment--------->', err);
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
        console.log(err);
      }
    );
  }

  upvote(id) {
    //allow upvote only if bool is false
    if (id && this.bool !== true) {
      let voteUrl = 'http://localhost:3030/votes';
      let query = `?text=upvote&postID=${id}&userID=${this.userID}`;
      this.httpService.patchRequest(voteUrl + query, null, this.headerParams).subscribe(
        res => {
          this.totalVotes = res['totalVotes'];
          this.bool = true;
          console.log('upvote: res-------------->', res);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  downvote(id) {
    //allow downvote only if bool is true
    if (id && this.bool !== false) {
      let voteUrl = 'http://localhost:3030/votes';
      let query = `?text=downvote&postID=${id}&userID=${this.userID}`;

      this.httpService.patchRequest(voteUrl + query, null, this.headerParams).subscribe(
        res => {
          this.totalVotes = res['totalVotes'];
          console.log('downvote: res-----------', res);
          this.bool = false;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  deletePost(postID) {
    console.log('postid: add-comment ------->', postID);
    this.httpService.deleteRequest(`${this.postsUrl}/${postID}`, this.headerParams).subscribe(
      res => {
        console.log('delete post: add comment: res----->', res);
        this.isDeleted = true;
        this.router.navigate(['r']);
        const snackbarRef = this.snackbar.open('Deleted post successfully', 'OK', {
          duration: 1500,
          verticalPosition: 'top',
          panelClass: 'login-snackbar'
        });
      },
      err => {
        this.isDeleted = false;
        console.log('delete post: add comment: err------>', err);
      }
    );
  }

  addComment() {
    let data = {
      text: this.text,
      postID: this.postID,
      userID: this.userID
    };

    this.httpService.postRequest(this.commentsUrl, data, this.headerParams).subscribe(
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

  updateCommentsCount($event) {
    if ($event) {
      if ($event === 'comment added') {
        this.totalComments += 1;
      } else if ($event === 'comment deleted') {
        this.totalComments -= 1;
      }
    }
  }
}
