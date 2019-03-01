import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpHeaders } from '@angular/common/http';
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
  constructor(public http: HttpService) {}

  ngOnInit() {
    this.userID = JSON.parse(localStorage.getItem('user'))['user']['id'];
    this.accessToken = JSON.parse(localStorage.getItem('user'))['user']['accessToken'];
    console.log(this.userID, this.accessToken);
    this.headerParams = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.accessToken
      })
    };
    console.log('header params-------->', this.headerParams);
    this.query = '/?userID=' + this.userID;
    this.http.getRequest(this.url + this.query, this.headerParams).subscribe(
      posts => {
        if (posts) {
          console.log('ngOnInit: posts----->', posts);
        }
      },
      err => {
        console.log('ngOnInit: err--->', err);
      }
    );
  }
}
