import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';
import { FilterService } from 'src/app/navigation/top-navigation/filter.service';
@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {
  public userID: any = '';
  public headerParams: any = {};
  public posts: object[] = [];
  public user: object = {};
  public postsUrl: string = 'http://localhost:3030/posts';
  public commentsUrl: string = 'http://localhost:3030/comments';

  constructor(
    public activatedRoute: ActivatedRoute,
    public httpService: HttpService,
    public tokenService: TokenService,
    public snackbar: MatSnackBar,
    public filterService: FilterService
  ) {}

  async ngOnInit() {
    this.userID = this.activatedRoute.snapshot['_urlSegment']['segments'][1]['path'];

    console.log(this.userID, 'userID: gOnInit: user-posts.component');
    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    this.filterService.filterValue$.subscribe(res => {
      if (res === 'Old') {
        let query = `&$populate=userID&$populate=communityID&$sort[createdAt]=1`;
        this.getPosts(query);
      } else if (res === 'Recent') {
        let query = `&$populate=userID&$populate=communityID&$sort[createdAt]=-1`;
        this.getPosts(query);
      }
    });

    let populateQuery = '&$populate=userID&$populate=communityID';
    this.getPosts(populateQuery);
  }

  async getPosts(query) {
    let posts = await this.httpService.getRequest(`${this.postsUrl}/?userID=${this.userID}` + query, this.headerParams);
    posts.subscribe(
      res => {
        if (res.hasOwnProperty('data')) {
          this.posts = [];
          console.log('ngOnInit: posts: user-posts----->', res);
          this.posts = res['data'];
          //check for creator of posts and enable delete button only if true.
          this.posts.forEach(post => {
            post['createdAt'] = moment(post['createdAt']).fromNow();

            if (this.userID === post['userID']['_id']) {
              post['creator'] = true;
            } else {
              post['creator'] = false;
            }
          });
        }
      },
      err => {
        this.showNotification(err, 'err', 'posts were not recevied');
      }
    );
  }

  async deletePost(postID) {
    // console.log(postID);
    let query = `/?postID=${postID}`;
    if (window.confirm('Are you sure you want to delete this?')) {
      let comments = await this.httpService.deleteRequest(this.commentsUrl + query, this.headerParams);
      comments.subscribe(
        res => {
          console.log('deleted comments--->', res);
          if (res['length'] > 0) {
            let index = this.posts.findIndex(post => post['_id'] == postID);
            this.posts[index]['comments'] = [];
          }
        },
        err => {
          this.showNotification(err, 'err', 'could not delete associated comments to this post');
        }
      );

      let posts = await this.httpService.deleteRequest(`${this.postsUrl}/${postID}`, this.headerParams);
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

  showNotification(err, type, message) {
    console.log('err: show notification: user-profile', err);

    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }
}
