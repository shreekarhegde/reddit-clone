import { HttpService } from '../../services/http.service';
import { MatSnackBar } from '@angular/material';
import { TokenService } from '../../services/token.service';
import { UserDetailsService } from '../../services/user-details.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-post',
  templateUrl: './display-post.component.html',
  styleUrls: ['./display-post.component.css']
})
export class DisplayPostComponent implements OnInit {
  public postsUrl = 'http://localhost:3030/posts';
  public commentsUrl = 'http://localhost:3030/comments';
  public query;
  public userID;
  public accessToken;
  public headerParams;
  public posts = [];
  public comments = [];
  public username;
  public showSpinner = true;

  constructor(
    public http: HttpService,
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();

    this.query = '?$populate=userID&$populate=communityID';

    await this.http.getRequest(this.postsUrl + this.query, this.headerParams).subscribe(
      async posts => {
        if (posts.hasOwnProperty('data')) {
          this.showSpinner = false;
          console.log('ngOnInit: posts----->', posts);
          this.posts = posts['data'];

          this.posts.forEach(async post => {
            console.log('post: display post------>', post);
            post['comments'] = [];
            let postQuery = '/?postID=' + post['_id'];
            console.log(postQuery);
            this.http.getRequest(this.commentsUrl + postQuery, this.headerParams).subscribe(
              async res => {
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
        } else {
          this.showSpinner = true;
        }
      },
      err => {
        console.log('ngOnInit: err--->', err);
      }
    );
  }
}
