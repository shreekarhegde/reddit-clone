import { HttpService } from '../../services/http.service';

import { TokenService } from '../../services/token.service';
import { UserDetailsService } from '../../services/user-details.service';
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

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

  constructor(public http: HttpService, public tokenService: TokenService, public userDetailsService: UserDetailsService) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();

    // console.log(this.headerParams);

    this.query = '?$populate=userID';

    await this.http.getRequest(this.postsUrl + this.query, this.headerParams).subscribe(
      async posts => {
        if (posts.hasOwnProperty('data')) {
          console.log('ngOnInit: posts----->', posts);
          this.posts = await posts['data'];

          this.posts.forEach(async post => {
            post['comments'] = [];
            let postQuery = '/?postID=' + post['_id'];
            await this.http.getRequest(this.commentsUrl + postQuery, this.headerParams).subscribe(
              async res => {
                if (res.hasOwnProperty('data')) {
                  post['comments'] = await res['data'];
                }
              },
              err => {
                console.log(err);
              }
            );
          });
        }
      },
      err => {
        console.log('ngOnInit: err--->here', err);
      }
    );
  }
}
