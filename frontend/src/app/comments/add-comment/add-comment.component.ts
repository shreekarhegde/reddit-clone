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
  public bool: boolean;
  public usersUrl: string = 'http://localhost:3030/users';
  public postsUrl: string = 'http://localhost:3030/posts';
  public commentsUrl: string = 'http://localhost:3030/comments';
  public profileName: string = '';
  public postTitle: string = '';
  public postedBy: string = '';
  public postDescription: string = '';
  public headerParams: string = '';
  public postID: string = '';
  public totalVotes: number = 0;
  public userID: string = '';
  public comments: object[] = [];
  public isDeleted: boolean = false;
  public text: string = '';
  public parentCommentID: string = '';
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

          //get no.of comments
          let postQuery = `/?postID=${post['_id']}`;
          this.httpService.getRequest(`http://localhost:3030/comments` + postQuery, this.headerParams).subscribe(
            res => {
              this.comments = res['data']['length'];
            },
            err => {
              console.log('err: ngOnInit: add-comment--------->', err);
            }
          );

          this.postDescription = post['text'];
          if (post['upvotedBy'].indexOf(this.userID) >= 0) {
            console.log('add-comment-------->upvoted true');
            //set bool to true if userID is present in upvoters array of a post
            this.bool = true;
          } else if (post['downvotedBy'].indexOf(this.userID) >= 0) {
            console.log('add-comment-------->downvoted true');
            //set bool to false if userID is present in downvoters array of a post
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
    //allow upvote only if bool is false
    if (id && this.bool !== true) {
      let voteUrl = 'http://localhost:3030/votes';
      let query = `?text=upvote&postID=${id}&userID=${this.userID}`;
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
    //allow downvote only if bool is true
    if (id && this.bool !== false) {
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

  deletePost(postID) {
    console.log('postid: add-comment ------->', postID);
    this.httpService.deleteRequest(`${this.postsUrl}/${postID}`, this.headerParams).subscribe(
      res => {
        console.log('delete post: add comment: res----->', res);
        this.isDeleted = true;
      },
      err => {
        this.isDeleted = false;
        console.log('delete post: add comment: err------>', err);
      }
    );
  }

  comment() {
    let data = {
      text: this.text,
      postID: this.postID,
      userID: this.userID
    };
    this.httpService.postRequest(this.commentsUrl, data, this.headerParams).subscribe(
      res => {
        console.log('res: comment: add-comment------------>', res);
      },
      err => {
        console.log('err: comment: add-comment------------>', err);
      }
    );
    console.log('firstlevel', data);
  }
}
