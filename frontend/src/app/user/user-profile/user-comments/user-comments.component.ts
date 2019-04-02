import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { HttpService } from 'src/app/services/http.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import * as momemt from 'moment';
import { DataService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.css']
})
export class UserCommentsComponent implements OnInit {
  public userID: any = '';
  public headerParams: any = {};
  public user: any = {};
  public comments: object[] = [];
  public posts: object[] = [];
  public commentsUrl: string = 'http://localhost:3030/comments';
  public postsUrl: string = 'http://localhost:3030/posts';
  public usersUrl: string = 'http://localhost:3030/users';

  constructor(
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public httpService: HttpService,
    public snackbar: MatSnackBar,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public dataService: DataService
  ) {}

  async ngOnInit() {
    this.comments = [];

    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    this.userID = this.activatedRoute.snapshot['_urlSegment']['segments'][1]['path'];

    this.dataService.shareID(this.userID);

    console.log('snapshot', this.userID);
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

    this.headerParams = this.tokenService.checkTokenAndSetHeader();
    let query = `/?userID=${this.userID}&$populate=userID&$populate=postID`;
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

    let posts = await this.httpService.getRequest(this.postsUrl + query, this.headerParams);
    posts.subscribe(
      res => {
        this.posts = res['data'];
      },
      err => {
        console.log(err);
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
