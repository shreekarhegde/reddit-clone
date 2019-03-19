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

    this.userID = await this.userDetailsService.getUserID();

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

  upvote(id) {
    let voteUrl = 'http://localhost:3030/votes';
    let query = `?text=upvote&postID=${id}&userID=${this.userID}`;

    this.http.patchRequest(voteUrl + query, null, this.headerParams).subscribe(
      res => {
        console.log('upvoted', res);
        let index = this.posts.findIndex(post => post['_id'] == id);
        console.log('index of upvoted post---------->', index);
        this.posts[index]['totalVotes'] = res['totalVotes'];
      },
      err => {
        console.log(err);
      }
    );
  }
  downvote(id) {
    let voteUrl = 'http://localhost:3030/votes';
    let query = `?text=downvote&postID=${id}&userID=${this.userID}`;

    this.http.patchRequest(voteUrl + query, null, this.headerParams).subscribe(
      res => {
        console.log('downvoted', res);

        let index = this.posts.findIndex(post => post['_id'] == id);
        console.log('index of downvoted post---------->', index);
        this.posts[index]['totalVotes'] = res['totalVotes'];
        console.log(this.posts[index]);
      },
      err => {
        console.log(err);
      }
    );
  }
}
