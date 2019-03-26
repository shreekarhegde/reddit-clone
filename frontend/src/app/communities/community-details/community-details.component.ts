import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-community-details',
  templateUrl: './community-details.component.html',
  styleUrls: ['./community-details.component.css']
})
export class CommunityDetailsComponent implements OnInit {
  public communityID: string = '';
  public headerParams: object = {};
  public community: object = {};
  public posts: object[] = [];
  public postsUrl: string = 'http://localhost:3030/posts';
  public communitiesUrl: string = 'http://localhost:3030/communities';
  public commentsUrl: string = 'http://localhost:3030/comments';

  constructor(
    public activeRoute: ActivatedRoute,
    public httpService: HttpService,
    public tokenService: TokenService,
    public snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();

    await this.activeRoute.params.subscribe(
      params => {
        if (params) {
          this.communityID = params['id'];
        }
      },
      err => {
        console.log('add-comment: err------->', err);
        const snackbarRef = this.snackbar.open('something went wrong', '', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: 'login-snackbar'
        });
      }
    );

    await this.httpService.getRequest(`${this.communitiesUrl}/${this.communityID}`, this.headerParams).subscribe(
      res => {
        console.log('community--------->', res);
        if (res) {
          this.community = res;
        }
      },
      err => {
        const snackbarRef = this.snackbar.open('something went wrong', '', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: 'login-snackbar'
        });
      }
    );

    let query = `?communityID=${this.communityID}&$populate=userID`;

    await this.httpService.getRequest(this.postsUrl + query, this.headerParams).subscribe(
      res => {
        if (res.hasOwnProperty('data')) {
          console.log('posts associated with community-------->', res);
          this.posts = res['data'];
          this.posts.map(post => {
            let postQuery = `postID=${post['_id']}`;
            this.httpService.getRequest(`${this.commentsUrl}/?${postQuery}`, this.headerParams).subscribe(
              res => {
                post['comments'] = res['data'];
              },
              err => {
                console.log(err);
              }
            );
          });
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
  }
}
