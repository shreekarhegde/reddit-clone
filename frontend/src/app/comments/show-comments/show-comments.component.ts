import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { FormGroup, NgForm } from '@angular/forms';
@Component({
  selector: 'app-show-comments',
  templateUrl: './show-comments.component.html',
  styleUrls: ['./show-comments.component.css']
})
export class ShowCommentsComponent implements OnInit {
  public form: FormGroup;
  public userID: string = '';
  public commentsUrl = 'http://localhost:3030/comments';
  public postID: string = '';
  public headerParams: object = {};
  public firstLevelComments: object[] = [];
  public childComments: object[] = [];
  @Input() innerComments = [];
  @Input() reOcurringCall = false;
  @Input() commentFromAddCommentComponent: object = {};
  constructor(
    public httpService: HttpService,
    public userDetailsService: UserDetailsService,
    public tokenService: TokenService,
    public activeRoute: ActivatedRoute,
    public addComment: AddCommentComponent
  ) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();

    this.userID = await this.userDetailsService.getUserID();

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
    if (this.reOcurringCall) return;

    console.log('show-comments: this.reOcurringCall -->', this.reOcurringCall);

    let query = `?postID=${this.postID}&$populate=userID`;

    //get all comments and check for first level comments. If parentCommentID is null, find their child comments.
    this.httpService.getRequest(this.commentsUrl + query, this.headerParams).subscribe(
      async comments => {
        console.log('show-comments: all comments------->', comments);
        if (comments) {
          for (let i = 0; i < comments['data'].length; i++) {
            if (!comments['data'][i].hasOwnProperty('parentCommentID')) {
              let query = '/?parentCommentID=' + comments['data'][i]['_id'];

              let commentsResponse = await this.httpService.getRequest('http://localhost:3030/child-comments' + query, this.headerParams);

              commentsResponse.subscribe(
                res => {
                  if (res['data']) {
                    this.firstLevelComments.push({ self: comments['data'][i], innerComments: res['data'] });
                  } else {
                    this.firstLevelComments.push({ self: comments['data'][i], innerComments: [] });
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

  comment(f: NgForm) {
    //loop over f, find which input field has been submitted, take its id which is parentCommentID
    for (let parentCommentID in f.value) {
      if (f.value[parentCommentID]['length'] > 0) {
        let text = f.value[parentCommentID];
        let data = {
          text: text,
          postID: this.postID,
          parentCommentID: parentCommentID,
          userID: this.userID
        };
        console.log('data----------->', data);
        if (data) {
          this.httpService.postRequest(this.commentsUrl, data, this.headerParams).subscribe(
            res => {
              console.log('res: comment: show-comments----->', res);
              let children = { data: [] };
              children.data.push(res);
              this.innerComments.push({ children });
              console.log('inner comments after push---->', this.innerComments);
            },
            err => {
              console.log(err);
            }
          );
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes['commentFromAddCommentComponent']['currentValue']);
    console.log('comment from add comment: ngOnChanges---------->', this.commentFromAddCommentComponent);
    let newComment = changes['commentFromAddCommentComponent']['currentValue'];
    if (newComment) {
      this.firstLevelComments.push({ self: newComment, innerComments: [] });
    }
  }
}
