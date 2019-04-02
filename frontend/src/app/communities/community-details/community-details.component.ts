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
  public isStillLoading: boolean = true;

  constructor(
    public activeRoute: ActivatedRoute,
    public httpService: HttpService,
    public tokenService: TokenService,
    public snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    this.activeRoute.params.subscribe(
      params => {
        if (params) {
          this.communityID = params['id'];
        }
      },
      err => {
        this.showErrorNotification(err, 'err', 'id was not recevied');
      }
    );

    this.httpService.getRequest(`${this.communitiesUrl}/${this.communityID}`, this.headerParams).subscribe(
      res => {
        console.log('community--------->', res);
        if (res) {
          this.community = res;
          this.isStillLoading = false;
        }
      },
      err => {
        this.showErrorNotification(err, 'err', 'community was not recevied');
      }
    );

    let query = `?communityID=${this.communityID}&$populate=userID`;

    this.httpService.getRequest(this.postsUrl + query, this.headerParams).subscribe(
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
                this.showErrorNotification(err, 'err', 'comments were not recevied');
              }
            );
          });
        }
      },
      err => {
        this.showErrorNotification(err, 'err', 'posts were not recevied: community-details');
      }
    );
  }

  showErrorNotification(err, type, message) {
    console.log('err: showErrorNotification: community-details----->', err);
    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }
}
