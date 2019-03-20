import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-comments',
  templateUrl: './show-comments.component.html',
  styleUrls: ['./show-comments.component.css']
})
export class ShowCommentsComponent implements OnInit {
  public commentsUrl = 'http://localhost:3030/comments';
  public postID;
  public headerParams;
  public firstLevelComments = [];
  public childComments;
  // @Input() comments = [];
  @Input() innerComments = [];
  @Input() reOcurringCall = false;

  constructor(
    public httpService: HttpService,
    public userDetailsService: UserDetailsService,
    public tokenService: TokenService,
    public activeRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    console.log('show-comments: this.reOcurringCall -->', this.reOcurringCall);
    if (this.reOcurringCall) return;

    this.headerParams = await this.tokenService.checkTokenAndSetHeader();

    //get post id sent from display post component
    this.activeRoute.params.subscribe(
      params => {
        this.postID = params['id'];
        console.log('postID--------->', this.postID);
      },
      err => {
        console.log('add-comment: err------->', err);
      }
    );

    let query = `?postID=${this.postID}&$populate=userID`;

    //get all comments and check for first level comments. If parentCommentID is null, find their child comments.
    this.httpService.getRequest(`${this.commentsUrl}` + query, this.headerParams).subscribe(
      async comments => {
        console.log('show-comments: all comments------->', comments);
        if (comments) {
          for (let i = 0; i < comments['data'].length; i++) {
            console.log(comments['data'][i].hasOwnProperty('parentCommentID'));
            if (!comments['data'][i].hasOwnProperty('parentCommentID')) {
              console.log('first level comments-------->', comments['data'][i]);
              let query = '/?parentCommentID=' + comments['data'][i]['_id'];

              let commentsResponse = await this.httpService.getRequest('http://localhost:3030/child-comments' + query, this.headerParams);

              commentsResponse.subscribe(
                async res => {
                  if (res['data']) {
                    console.log('res.data----------->', res['data']);
                    this.firstLevelComments.push({ self: comments['data'][i], innerComments: res['data'] });
                    // this.innerComments = res['data'];
                  }
                },
                err => {
                  console.log(err);
                }
              );
            }
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
