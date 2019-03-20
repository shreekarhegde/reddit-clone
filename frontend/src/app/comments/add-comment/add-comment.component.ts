import { Component, OnInit } from '@angular/core';
import { UserDetailsService } from '../../services/user-details.service';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  public post;
  public bool;
  public usersUrl = 'http://localhost:3030/users';
  public postsUrl = 'http://localhost:3030/posts';
  public profileName;
  public postTitle;
  public postedBy;
  public postDescription;
  public headerParams;
  public postID;
  public totalVotes;
  public userID;
  constructor(
    public userDetailsService: UserDetailsService,
    public httpService: HttpService,
    public tokenService: TokenService,
    public activeRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();
    this.userID = await this.userDetailsService.getUserID();

    this.userDetailsService
      .getUserProfile()
      .then(user => {
        console.log('user: addComment------>', user);
        if (user.hasOwnProperty('username')) {
          this.profileName = user['username'];
        }
      })
      .catch(err => {
        console.log(err);
      });

    this.activeRoute.params.subscribe(
      params => {
        this.postID = params['id'];
      },
      err => {
        console.log('add-comment: err------->', err);
      }
    );

    let query = `?$populate=userID`;

    this.httpService.getRequest(`${this.postsUrl}/${this.postID}` + query, this.headerParams).subscribe(
      post => {
        console.log('add-comment: posts------->', post);
        if (post) {
          this.postedBy = post['userID']['username'];
          this.totalVotes = post['totalVotes'];
          this.postTitle = post['title'];
          this.postDescription = post['text'];
          if (post['upvotedBy'].indexOf(this.userID) >= 0) {
            console.log('add-comment-------->upvoted true');
            this.bool = true;
          } else if (post['downvotedBy'].indexOf(this.userID) >= 0) {
            console.log('add-comment-------->downvoted true');
            this.bool = false;
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  upvote(id) {
    console.log(this.bool, 'expected');
    if (id && !this.bool) {
      let voteUrl = 'http://localhost:3030/votes';
      let query = `?text=upvote&postID=${id}&userID=${this.userID}`;

      console.log('-------not upvoted--------');
      this.httpService.patchRequest(voteUrl + query, null, this.headerParams).subscribe(
        res => {
          this.totalVotes = res['totalVotes'];
          this.bool = true;
          console.log('upvote: res-------------->', res);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
  downvote(id) {
    if (id && this.bool) {
      let voteUrl = 'http://localhost:3030/votes';
      let query = `?text=downvote&postID=${id}&userID=${this.userID}`;

      this.httpService.patchRequest(voteUrl + query, null, this.headerParams).subscribe(
        res => {
          this.totalVotes = res['totalVotes'];
          console.log('downvote: res-----------', res);
          this.bool = false;
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}
