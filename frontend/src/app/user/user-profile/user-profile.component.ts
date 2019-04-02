import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { HttpService } from 'src/app/services/http.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import * as momemt from 'moment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public userID: any = '';
  public headerParams: any = {};
  public user: any = {};
  public comments: object[] = [];
  public commentsUrl: string = 'http://localhost:3030/comments';
  public postsUrl: string = 'http://localhost:3030/posts';
  public usersUrl: string = 'http://localhost:3030/users';
  constructor(
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public httpService: HttpService,
    public snackbar: MatSnackBar,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    this.activatedRoute.params.subscribe(
      async params => {
        if (params) {
          console.log(params, 'userID on navigation');
          this.userID = params['id'];
          let user = await this.httpService.getRequest(`${this.usersUrl}/${this.userID}`, this.headerParams);
          user.subscribe(
            res => {
              this.user = res;
              console.log('user: user-profile: ngOnInit------>', this.user);
            },
            err => {
              console.log('err: user-profile: ngOnInit------>', err);
            }
          );
        }
      },
      err => {
        this.showNotification(err, 'err', 'id was not recevied');
      }
    );

    this.headerParams = this.tokenService.checkTokenAndSetHeader();
    let query = `/?userID=${this.userID}&$populate=userID&$populate[]=postID&$populate=communityID`;
    let comments = await this.httpService.getRequest(this.commentsUrl + query, this.headerParams);
    comments.subscribe(
      res => {
        if (res.hasOwnProperty('data')) {
          console.log('comments: user-profile: ngOnInit------>', res);
          this.comments = res['data'];
          this.comments.forEach(async comment => {
            let query = `?$populate=userID`;
            let posts = await this.httpService.getRequest(`${this.postsUrl}/${comment['postID']['_id']}${query}`, this.headerParams);
            posts.subscribe(
              res => {
                comment['postID']['postedBy'] = res['userID']['username'];

                comment['createdAt'] = momemt(comment['createdAt']).fromNow();
              },
              err => {
                this.showNotification(err, 'err', 'could not recevie post');
              }
            );
          });
        }
      },
      err => {
        this.showNotification(err, 'err', 'could not recevie comments');
      }
    );
  }

  deleteComment(id: string) {
    if (window.confirm('Are you sure you want to delete this?')) {
      let deletedComment = this.httpService.deleteRequest(`${this.commentsUrl}/${id}`, this.headerParams);
      deletedComment.subscribe(
        res => {
          let index = this.comments.findIndex(comment => comment['_id'] === res['_id']);
          this.comments.splice(index, 1);
        },
        err => {
          this.showNotification(err, 'err', 'could not delete comment');
        }
      );
    }
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
