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
  public text: string = '';
  public title: string = '';
  public selectedCommunity: string = '';
  public userID: string = '';
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
    this.userID = await this.userDetailsService.getUserID();
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();
    let query = `?$populate=communities`;
    await this.http.getRequest(`${this.usersUrl}/${this.userID}${query}`, this.headerParams).subscribe(
      user => {
        if (user) {
          console.log('user: create-post: ngOnInit-------->', user);
          this.communities = user['communities'];
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

  async post() {
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
  }

  selectChange(id: any) {
    this.selectedCommunity = id;
    this.communityName = this.communities.find(community => community['_id'] === id)['name'];
    console.log('community name------->', this.communityName);
  }

  selectACommunityFirst() {
    const snackbarRef = this.snackbar.open('please select a community', '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'login-snackbar'
    });
  }
}
