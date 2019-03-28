import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, NgForm } from '@angular/forms';
import { ToggleService } from '../add-comment/toggle.service';
import { takeWhile, takeUntil, skip } from 'rxjs/operators';
@Component({
  selector: 'app-show-comments',
  templateUrl: './show-comments.component.html',
  styleUrls: ['./show-comments.component.css']
})
export class ShowCommentsComponent implements OnInit, OnChanges, OnDestroy {
  public form: FormGroup;
  public userID: string = '';
  public commentsUrl = 'http://localhost:3030/comments';
  public postID: string = '';
  public headerParams: object = {};
  public firstLevelComments: object[] = [];
  public childComments: object[] = [];
  public alive: boolean = true;
  @Input() innerComments = [];
  @Input() reOcurringCall = false;
  // @Input() refreshCommentsList = false;
  @Input() commentFromAddCommentComponent: object = {};
  constructor(
    public httpService: HttpService,
    public userDetailsService: UserDetailsService,
    public tokenService: TokenService,
    public activeRoute: ActivatedRoute,
    public toggleService: ToggleService
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

    this.toggleService.toggleValue$
      .pipe(takeWhile(() => this.alive))
      .pipe(skip(1))
      .subscribe(
        res => {
          console.log('===========', res);
          if (res) {
            this.displayComments();
          }
        },
        err => {
          console.log(err);
        }
      );
    this.displayComments();
  }

  displayComments() {
    this.firstLevelComments = [];
    // this.serviceToggle = false;
    // this.toggleService.setToggleValue(false);

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
                  this.toggleService.setToggleValue(false);

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

  addComment(f: NgForm) {
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

              this.toggleService.setToggleValue(true);
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
    // if (changes.hasOwnProperty('commentFromAddCommentComponent')) {
    //   console.log('comment from add comment: ngOnChanges---------->', this.commentFromAddCommentComponent);
    //   let newComment = changes['commentFromAddCommentComponent']['currentValue'];
    //   if (newComment) {
    //     this.firstLevelComments.push({ self: newComment, innerComments: [] });
    //   }
    // }
    // if (!this.reOcurringCall && changes.hasOwnProperty('refreshCommentsList')) {
    //   console.log('showComments ngOnChanges: Refresh request from add comment: changes---------->', changes['refreshCommentsList']);
    //   let refreshToggle = changes['refreshCommentsList']['currentValue'];
    // if (refreshToggle) {
    //   this.displayComments();
    // }
    // }
    console.log(changes);
    // if (changes.hasOwnProperty('commentFromAddCommentComponent')) {
    //   console.log('========== onchange', changes['commentFromAddCommentComponent']['currentValue']);
    //   if (changes['toggleValue$']['currentValue']) {
    //     this.displayComments();
    //   }
    // }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
