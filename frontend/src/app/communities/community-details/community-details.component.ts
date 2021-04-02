import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import { MatSnackBar } from '@angular/material';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { MessageService } from './message.service';

const POSTS_URL = 'http://localhost:3030/api/posts';
const COMMUNITIES_URL = 'http://localhost:3030/api/communities';
const COMMENTS_URL = 'http://localhost:3030/api/comments';
const VOTES_URL = 'http://localhost:3030/api/votes';

@Component({
  selector: 'app-community-details',
  templateUrl: './community-details.component.html',
  styleUrls: ['./community-details.component.css']
})
export class CommunityDetailsComponent implements OnInit {
  private communityID: string = '';
  private headerParams: object = {};
  public community: object = {};
  public posts: object[] = [];
  public isStillLoading: boolean = true;
  private userID: any = '';

  constructor(
    public activeRoute: ActivatedRoute,
    public httpService: HttpService,
    public tokenService: TokenService,
    public snackbar: MatSnackBar,
    public userDetailsService: UserDetailsService,
    public messageService: MessageService
  ) {}

  async ngOnInit() {
    this.messageService.shareMessageValue(true);
    this.userID = await this.userDetailsService.getUserID();

    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    this.activeRoute.params.subscribe(
      params => {
        if (params) {
          this.communityID = params['id'];
        }
      },
      err => {
        this.showNotification(err, 'err', 'id was not recevied');
      }
    );

    this.httpService.getRequest(`${COMMUNITIES_URL}/${this.communityID}`, this.headerParams).subscribe(
      res => {
        console.log('community--------->', res);
        if (res) {
          this.community = res;
          this.isStillLoading = false;
        }
      },
      err => {
        this.showNotification(err, 'err', 'community was not recevied');
      }
    );

    let query = `?communityID=${this.communityID}&$populate=userID`;

    this.httpService.getRequest(POSTS_URL + query, this.headerParams).subscribe(
      res => {
        if (res.hasOwnProperty('data')) {
          console.log('posts associated with community-------->', res);
          this.posts = res['data'];
          this.posts.map(post => {
            let postQuery = `postID=${post['_id']}`;
            this.httpService.getRequest(`${COMMENTS_URL}/?${postQuery}`, this.headerParams).subscribe(
              res => {
                post['comments'] = res['data'];
              },
              err => {
                this.showNotification(err, 'err', 'comments were not recevied');
              }
            );
          });
        }
      },
      err => {
        this.showNotification(err, 'err', 'posts were not recevied: community-details');
      }
    );
  }

  upvote(id) {
    let index = this.posts.findIndex(post => post['_id'] === id);
    // console.log('index-------------->', index);
    if (!this.posts[index]['upvotedBy'].includes(this.userID) && id) {
      let query = `?text=upvote&postID=${id}&userID=${this.userID}`;

      this.httpService.patchRequest(VOTES_URL + query, null, this.headerParams).subscribe(
        res => {
          // console.log('upvoted', res);
          let index = this.posts.findIndex(post => post['_id'] == id);
          console.log('index of upvoted post---------->', index);
          this.posts[index]['totalVotes'] = res['totalVotes'];
          //if user is not present in upvoters array push him on the fly. Nothing do with db.
          this.posts[index]['upvotedBy'].push(this.userID);
          this.posts[index]['downvotedBy'].pop(this.userID);
        },
        err => {
          this.showNotification(err, 'err', 'could not upvote');
        }
      );
    }
  }
  downvote(id) {
    let index = this.posts.findIndex(post => post['_id'] === id);
    if (!this.posts[index]['downvotedBy'].includes(this.userID) && id) {
      let query = `?text=downvote&postID=${id}&userID=${this.userID}`;

      this.httpService.patchRequest(VOTES_URL + query, null, this.headerParams).subscribe(
        res => {
          // console.log('downvoted', res);
          let index = this.posts.findIndex(post => post['_id'] == id);
          console.log('index of downvoted post---------->', index);
          this.posts[index]['totalVotes'] = res['totalVotes'];
          //if user is not present in downvoters array push him on the fly. Nothing do with db.
          this.posts[index]['downvotedBy'].push(this.userID);
          this.posts[index]['upvotedBy'].pop(this.userID);
        },
        err => {
          this.showNotification(err, 'err', 'could not downvote');
        }
      );
    }
  }

  showNotification(err, type, message) {
    console.log('err: showErrorNotification: community-details----->', err);
    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }
}
