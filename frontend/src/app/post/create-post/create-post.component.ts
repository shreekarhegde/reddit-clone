import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { UserDetailsService } from '../../services/user-details.service';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  public text;
  public title;
  public userID;
  public headerParams;
  public postsUrl = 'http://localhost:3030/posts';
  public usersUrl = 'http://localhost:3030/users';
  public accessToken;
  constructor(
    public http: HttpService,
    public tokenService: TokenService,
    public router: Router,
    public userDetailsService: UserDetailsService
  ) {}

  ngOnInit() {}

  async post() {
    console.log('in post');
    this.userID = this.userDetailsService.getUserID();
    console.log('userID: post-------->', this.userID);

    if (this.text) {
      let data = {
        text: this.text,
        title: this.title,
        userID: this.userID,
        community: 'general'
      };

      this.headerParams = await this.tokenService.checkTokenAndSetHeader();

      console.log('headerparams: create post------>', this.headerParams);

      this.http.postRequest(this.postsUrl, data, this.headerParams).subscribe(
        res => {
          console.log('post: success------------->', res);
          if (res) {
            this.router.navigate(['/comments']);
          }
        },
        err => {
          console.log('post: err------------->', err);
        }
      );
    } else {
      console.log('from else');
    }
  }
}
