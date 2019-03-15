import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { UserDetailsService } from '../../services/user-details.service';
import { DataService } from 'src/app/services/data-service.service';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  public communityName = 'choose a community';
  public text;
  public title;
  public selectedCommunity;
  public userID;
  public headerParams;
  public communities;
  public postsUrl = 'http://localhost:3030/posts';
  public usersUrl = 'http://localhost:3030/users';
  public communitiesUrl = 'http://localhost:3030/communities';
  public accessToken;

  constructor(
    public http: HttpService,
    public tokenService: TokenService,
    public router: Router,
    public userDetailsService: UserDetailsService,
    public dataService: DataService
  ) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();

    await this.http.getRequest(this.communitiesUrl, this.headerParams).subscribe(
      communities => {
        console.log('communities: createpost------------>', communities['data']);
        this.communities = communities['data'];
      },
      err => {
        console.log(err);
      }
    );
  }

  async post() {
    console.log('in post');
    this.userID = this.userDetailsService.getUserID();
    console.log('userID: post-------->', this.userID);

    if (this.text) {
      let data = {
        text: this.text,
        title: this.title,
        userID: this.userID,
        communityID: this.selectedCommunity
      };

      console.log('headerparams: create post------>', this.headerParams);

      this.http.postRequest(this.postsUrl, data, this.headerParams).subscribe(
        res => {
          console.log('post: success------------->', res);
          if (res) {
            // this.dataService.setData(res);
            this.router.navigate(['/comments', res['_id']]);
          }
        },
        err => {
          console.log('post: err------------->', err);
        }
      );
    } else {
      console.log('from else');
    }
  }

  selectChange(id: any) {
    this.selectedCommunity = id;
    this.communityName = this.communities.find(community => community['_id'] === id)['name'];
    console.log('community name------->', this.communityName);
  }
}
