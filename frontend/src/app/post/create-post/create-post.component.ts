import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
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
  public url = 'http://localhost:3030/posts';
  public accessToken;
  constructor(public http: HttpService, public tokenService: TokenService, public router: Router) {}

  ngOnInit() {}

  post() {
    if (this.text) {
      let data = {
        text: this.text,
        title: this.title,
        userID: this.userID,
        community: 'general'
      };

      if (this.tokenService.getToken()) {
        this.accessToken = this.tokenService.getToken()['user']['accessToken']
          ? this.tokenService.getToken()['user']['accessToken']
          : this.tokenService.getToken()['user'];

        this.headerParams = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: this.accessToken
          })
        };

        this.http.postRequest(this.url, data, this.headerParams).subscribe(
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
        console.log('token not found-----> create post');
      }
    }
  }
}
