import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { UserDetailsService } from '../../services/user-details.service';
import { MatSnackBar } from '@angular/material';
import { MessageService } from 'src/app/communities/community-details/message.service';

const POSTS_URL = 'http://localhost:3030/posts';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  public communityName: string = 'choose a community';
  public user: any = {};
  public text: string = '';
  public title: string = '';
  public selectedCommunity: string = '';
  private userID: any = '';
  private headerParams: object = {};
  public communities: object[] = [];

  constructor(
    private http: HttpService,
    private tokenService: TokenService,
    private router: Router,
    private userDetailsService: UserDetailsService,
    private snackbar: MatSnackBar,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.messageService.shareMessageValue(true);

    this.userID = await this.userDetailsService.getUserID();

    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    let user = await this.userDetailsService.getUserProfile();

    this.communities = user['communities'];
  }

  addPost() {
    console.log('userID: post-------->', this.userID);

    if (this.title) {
      let data = {
        text: this.text,
        title: this.title,
        userID: this.userID,
        communityID: this.selectedCommunity ? this.selectedCommunity : this.selectACommunityFirst()
      };

      console.log('headerparams: create post------>', this.headerParams);
      if (data['communityID'] && data['communityID']['length'] > 0) {
        this.http.postRequest(POSTS_URL, data, this.headerParams).subscribe(
          res => {
            console.log('post: success------------->', res);
            if (res) {
              this.router.navigate(['/r/comments', res['_id']]);
            }
          },
          err => {
            this.showErrorNotification(err, 'err', 'post was not added');
          }
        );
      }
    }
  }

  selectCommunity(id: any) {
    this.selectedCommunity = id;
    this.communityName = this.communities.find(community => community['_id'] === id)['name'];
    console.log('community name------->', this.communityName);
  }

  selectACommunityFirst() {
    this.showErrorNotification(null, 'warning', 'please select a community');
  }

  showErrorNotification(err, type, message) {
    console.log(err);
    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }
}
