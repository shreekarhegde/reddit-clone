import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, NgForm } from '@angular/forms';
import { ToggleService } from '../add-comment/toggle.service';
import { takeWhile, takeUntil, skip } from 'rxjs/operators';
import { MatSnackBar, MatExpansionPanel } from '@angular/material';
@Component({
  selector: 'app-show-comments',
  templateUrl: './show-comments.component.html',
  styleUrls: ['./show-comments.component.css'],
  viewProviders: [MatExpansionPanel]
})
export class ShowCommentsComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public userID: any = '';
  public commentsUrl = 'http://localhost:3030/comments';
  public postID: string = '';
  public headerParams: object = {};
  public firstLevelComments: object[] = [];
  public childComments: object[] = [];
  public alive: boolean = true;
  @Input() innerComments = [];
  @Input() reOcurringCall = false;
  @Output() messageEvent = new EventEmitter<string>();

  @Input() commentFromAddCommentComponent: object = {};
  constructor(
    public httpService: HttpService,
    public userDetailsService: UserDetailsService,
    public tokenService: TokenService,
    public activeRoute: ActivatedRoute,
    public toggleService: ToggleService,
    public snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    this.userDetailsService
      .getUserID()
      .then(res => {
        this.userID = res;
      })
      .catch(err => {
        this.showErrorNotification(err, 'userID was not recevied');
      });

    //get post id sent from display post component
    this.activeRoute.params.subscribe(
      params => {
        this.postID = params['id'];
        console.log('postID--------->', this.postID);
      },
      err => {
        // console.log('add-comment: err------->', err);
        this.showErrorNotification(err, 'post id was not recevied: show-comments');
      }
    );
    if (this.reOcurringCall) return;

    console.log('show-comments: this.reOcurringCall -->', this.reOcurringCall);

    this.toggleService.toggleValue$
      .pipe(takeWhile(() => this.alive))
      .pipe(skip(1))
      .subscribe(
        res => {
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
                  // console.log(err);
                  this.showErrorNotification(err, 'child commets was not recevied: show-comments');
                }
              );
            }
          }
        }
      },
      err => {
        this.showErrorNotification(err, 'all commets were not recevied: show-comments');
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
              let message = 'comment added';
              this.messageEvent.emit(message);
              this.toggleService.setToggleValue(true);
            },
            err => {
              this.showErrorNotification(err, 'comment was not added: show-comments');
            }
          );
        }
      }
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

  showErrorNotification(err, message) {
    console.log(err);
    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'login-snackbar'
    });
  }
}
