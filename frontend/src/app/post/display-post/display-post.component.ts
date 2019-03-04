import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { HttpHeaders } from '@angular/common/http';
const jwtDecode = require('jwt-decode');

@Component({
  selector: 'app-display-post',
  templateUrl: './display-post.component.html',
  styleUrls: ['./display-post.component.css']
})
export class DisplayPostComponent implements OnInit {
  public url = 'http://localhost:3030/posts';
  public query;
  public userID;
  public accessToken;
  public headerParams;
  public posts = [];
  public username;
  constructor(public http: HttpService, public tokenService: TokenService) {}

  async ngOnInit() {
    console.log(this.tokenService.getToken(), 'token service from display post');
    this.accessToken = (await this.tokenService.getToken()['user']['accessToken'])
      ? await this.tokenService.getToken()['user']['accessToken']
      : await this.tokenService.getToken()['user'];
    this.headerParams = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.accessToken
      })
    };
    var decoded = jwtDecode(this.accessToken);
    this.userID = decoded.userId;
    console.log(decoded);

    // console.log('token from display post', this.accessToken);
    this.query = '/?userID=' + this.userID;
    // console.log('query from display post', this.query);
    await this.http.getRequest(this.url + this.query, this.headerParams).subscribe(
      res => {
        if (res.hasOwnProperty('data')) {
          console.log('ngOnInit: posts----->', res);
          this.posts = res['data'];
        }
      },
      err => {
        console.log('ngOnInit: err--->here', err);
      }
    );
  }
}
