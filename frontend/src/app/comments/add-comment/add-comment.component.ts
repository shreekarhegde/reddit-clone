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
  public usersUrl = 'http://localhost:3030/users';
  public postsUrl = 'http://localhost:3030/posts';
  public profileName;
  public postTitle;
  public postedBy;
  public postDescription;
  public headerParams;
  public postID;
  constructor(
    public userDetailsService: UserDetailsService,
    public httpService: HttpService,
    public tokenService: TokenService,
    public activeRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();

    await this.userDetailsService
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

    // let userID = await this.userDetailsService.getUserID();

    // let query = `?userID=${userID}&$sort[createdAt]=-1`;
    // let postID = await this.dataService.getData()['_id'];

    this.activeRoute.params.subscribe(
      params => {
        this.postID = params['id'];
      },
      err => {
        console.log('add-comment: err------->', err);
      }
    );

    let query = await `?$populate=userID`;
    console.log(query);
    await this.httpService.getRequest(`${this.postsUrl}/${this.postID}` + query, this.headerParams).subscribe(
      post => {
        console.log('add-comment: posts------->', post);
        if (post) {
          this.postedBy = post['userID']['username'];

          this.postTitle = post['title'];
          this.postDescription = post['text'];
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
