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
  @Input() comments;
  constructor(
    public httpService: HttpService,
    public userDetailsService: UserDetailsService,
    public tokenService: TokenService,
    public activeRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();
    this.activeRoute.params.subscribe(
      params => {
        this.postID = params['id'];
      },
      err => {
        console.log('add-comment: err------->', err);
      }
    );

    let query = `?postID=${this.postID}&$populate=userID`;

    await this.httpService.getRequest(`${this.commentsUrl}` + query, this.headerParams).subscribe(
      comments => {
        console.log('show-comments: comments------->', comments);
        if (comments) {
          console.log(comments);
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
