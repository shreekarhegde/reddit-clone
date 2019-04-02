import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';
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

  constructor(
    public activatedRoute: ActivatedRoute,
    public httpService: HttpService,
    public tokenService: TokenService,
    public snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.userID = this.activatedRoute.snapshot['_urlSegment']['segments'][1]['path'];
    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    let populateQuery = '/?$populate=userID&$populate=communityID';

    this.httpService.getRequest(this.postsUrl + populateQuery, this.headerParams).subscribe(
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
        this.showNotification(err, 'err', 'posts was not recevied');
      }
    );
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
