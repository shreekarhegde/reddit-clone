import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-community-details',
  templateUrl: './community-details.component.html',
  styleUrls: ['./community-details.component.css']
})
export class CommunityDetailsComponent implements OnInit {
  public communityID;
  public headerParams;
  public community;
  public posts;
  public postsUrl = 'http://localhost:3030/posts';
  public communitiesUrl = 'http://localhost:3030/communities';
  constructor(public activeRoute: ActivatedRoute, public httpService: HttpService, public tokenService: TokenService) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();

    await this.activeRoute.params.subscribe(
      params => {
        this.communityID = params['id'];
      },
      err => {
        console.log('add-comment: err------->', err);
      }
    );

    await this.httpService.getRequest(`${this.communitiesUrl}/${this.communityID}`, this.headerParams).subscribe(
      res => {
        console.log('community--------->', res);
        this.community = res;
      },
      err => {
        console.log(err);
      }
    );

    let query = `?communityID=${this.communityID}&$populate=userID`;

    await this.httpService.getRequest(this.postsUrl + query, this.headerParams).subscribe(
      res => {
        console.log('posts associated with community-------->', res);
        this.posts = res['data'];
      },
      err => {
        console.log(err);
      }
    );
  }
}
