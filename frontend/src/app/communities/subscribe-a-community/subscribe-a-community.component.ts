import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { HttpService } from 'src/app/services/http.service';
import { UserDetailsService } from 'src/app/services/user-details.service';

@Component({
  selector: 'app-subscribe-a-community',
  templateUrl: './subscribe-a-community.component.html',
  styleUrls: ['./subscribe-a-community.component.css']
})
export class SubscribeACommunityComponent implements OnInit {
  public communities = [];
  public headerParams;
  public communitiesUrl = 'http://localhost:3030/communities';
  constructor(public tokenService: TokenService, public httpService: HttpService, public userDetailsService: UserDetailsService) {}

  async ngOnInit() {
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();
    this.httpService.getRequest(this.communitiesUrl, this.headerParams).subscribe(
      communities => {
        console.log('get communities------->', communities);
        if (communities.hasOwnProperty('data')) {
          for (let i = 0; i < communities['data'].length; i++) {
            this.communities.push(communities['data'][i]);
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  async subscribe(id: string) {
    console.log('comunity id----->', id);

    let data = {
      subscriber: await this.userDetailsService.getUserID()
    };
    console.log('subscriber id------->', data);

    console.log('header params--------->', this.headerParams);
    this.httpService.patchRequest(`${this.communitiesUrl}/${id}`, data, this.headerParams).subscribe(
      res => {
        console.log('community subscribe----->', res);
        let index = this.communities.findIndex(community => community._id === id);
      },
      err => {
        console.log(err);
      }
    );
  }
}
