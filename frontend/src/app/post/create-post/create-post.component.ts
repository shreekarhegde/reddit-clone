import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { UserDetailsService } from '../../services/user-details.service';
// import { DataService } from 'src/app/services/data-service.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  public communityName: string = 'choose a community';
  public user: any = {};
  public text: string = '';
  public title: string = '';
  public selectedCommunity: string = '';
  public userID: any = '';
  public headerParams: object = {};
  public communities: object[] = [];
  public postsUrl: string = 'http://localhost:3030/posts';
  public usersUrl: string = 'http://localhost:3030/users';
  public communitiesUrl: string = 'http://localhost:3030/communities';
  public accessToken: string = '';

  constructor(
    public http: HttpService,
    public tokenService: TokenService,
    public router: Router,
    public userDetailsService: UserDetailsService,
    // public dataService: DataService,
    public snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.userDetailsService
      .getUserID()
      .then(res => {
        this.userID = res;
      })
      .catch(err => {
        this.showErrorNotification(err, 'userID was not recevied: create-post');
      });

    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    this.userDetailsService
      .getUserProfile()
      .then(res => {
        this.user = res;
        this.communities = this.user['communities'];
      })
      .catch(err => {
        this.showErrorNotification(err, 'user was not recevied: create-post');
      });
  }

  addPost() {
    console.log('userID: post-------->', this.userID);

    if (this.title) {
      let data = {
        text: this.text,
        title: this.title,
        userID: this.userID,
        communityID: this.selectedCommunity ? this.selectedCommunity : this.selectACommunityFirst()
      };

      console.log('headerparams: create post------>', this.headerParams);
      if (data['communityID']['length'] > 0) {
        this.http.postRequest(this.postsUrl, data, this.headerParams).subscribe(
          res => {
            console.log('post: success------------->', res);
            if (res) {
              this.router.navigate(['/r/comments', res['_id']]);
            }
          },
          err => {
            this.showErrorNotification(err, 'post was not added: create post');
          }
        );
      }
    }
  }

  selectChange(id: any) {
    this.selectedCommunity = id;
    this.communityName = this.communities.find(community => community['_id'] === id)['name'];
    console.log('community name------->', this.communityName);
  }

  selectACommunityFirst() {
    this.showErrorNotification(null, 'please select a community');
  }

  showErrorNotification(err, message) {
    console.log(err);
    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'login-snackbar'
    });
  }
}
