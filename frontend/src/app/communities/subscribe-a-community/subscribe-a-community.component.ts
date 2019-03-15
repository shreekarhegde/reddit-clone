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
    let user = await this.userDetailsService.getUserProfile();
    console.log('userCommunities: ngOnInit------->', user['communities']);

    this.headerParams = await this.tokenService.checkTokenAndSetHeader();
    this.httpService.getRequest(this.communitiesUrl, this.headerParams).subscribe(
      communities => {
        console.log('all communities------->', communities['data']);
        if (communities.hasOwnProperty('data')) {
          for (let i = 0; i < communities['data'].length; i++) {
            if (user['communities'].indexOf(communities['data'][i]['_id']) < 0) {
              this.communities.push(communities['data'][i]);
            }
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
    let query = `?id=${id}`;
    await this.httpService.patchRequest(`http://localhost:3030/update-community` + query, data, this.headerParams).subscribe(
      res => {
        console.log('here');
        console.log('community subscribe----->', res);
      },
      err => {
        console.log(err);
      }
    );
  }
}
