import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { HttpService } from 'src/app/services/http.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import * as momemt from 'moment';
import { DataService } from 'src/app/services/data-service.service';
import { FilterService } from 'src/app/navigation/top-navigation/filter.service';

const COMMENTS_URL = '/api/comments';
const POSTS_URL = '/api/posts';
const USERS_URL = '/api/users';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.css']
})
export class UserCommentsComponent implements OnInit {
  private userID: any = '';
  private headerParams: any = {};
  public user: any = {};
  public comments: object[] = [];
  public posts: object[] = [];
  public profileOwner: any = '';

  constructor(
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public httpService: HttpService,
    public snackbar: MatSnackBar,
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public filterService: FilterService
  ) {}

  async ngOnInit() {
    this.comments = [];

    this.profileOwner = await this.userDetailsService.getUserID();

    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    this.userID = this.activatedRoute.snapshot['_urlSegment']['segments'][1]['path'];

    this.dataService.shareID(this.userID);

    console.log('snapshot', this.userID);
    let user = await this.httpService.getRequest(`${USERS_URL}/${this.userID}`, this.headerParams);
    user.subscribe(
      res => {
        this.user = res;
        console.log('user: user-profile: ngOnInit------>', this.user);
      },
      err => {
        this.showNotification(err, 'err', 'could not revevie user details');
      }
    );

    let query = `/?userID=${this.userID}&$populate=postID&$populate=userID`;
    this.getComments(query);

    this.filterService.filterValue$.subscribe(res => {
      if (res === 'Old') {
        let query = `/?userID=${this.userID}&$populate=postID&$populate=userID&$sort[createdAt]=1`;
        this.getComments(query);
      } else if (res == 'Recent') {
        let query = `/?userID=${this.userID}&$populate=postID&$populate=userID&$sort[createdAt]=-1`;
        this.getComments(query);
      }
    });

    let posts = await this.httpService.getRequest(POSTS_URL + query, this.headerParams);
    posts.subscribe(
      res => {
        this.posts = res['data'];
      },
      err => {
        console.log(err);
      }
    );
  }

  async getComments(query) {
    let comments = await this.httpService.getRequest(COMMENTS_URL + query, this.headerParams);
    comments.subscribe(
      res => {
        if (res.hasOwnProperty('data') && res['data'].length > 0) {
          console.log('comments: user-profile: ngOnInit------>', res);
          this.comments = res['data'];
          this.comments.forEach(async comment => {
            let query = `?$populate=userID`;
            let posts = await this.httpService.getRequest(`${POSTS_URL}/${comment['postID']['_id']}${query}`, this.headerParams);
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
      let deletedComment = this.httpService.deleteRequest(`${COMMENTS_URL}/${id}`, this.headerParams);
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
