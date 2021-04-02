import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { HttpService } from 'src/app/services/http.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { DataService } from 'src/app/services/data-service.service';
import { MatSnackBar } from '@angular/material';

const COMMUNITIES_URL = 'http://localhost:3030/communities';

@Component({
  selector: 'app-subscribe-a-community',
  templateUrl: './subscribe-a-community.component.html',
  styleUrls: ['./subscribe-a-community.component.css']
})
export class SubscribeACommunityComponent implements OnInit {
  public communities: object[] = [];
  public headerParams: object = {};
  public user: any = {};
  public isStillLoading: boolean = false;
  constructor(
    public tokenService: TokenService,
    public httpService: HttpService,
    public userDetailsService: UserDetailsService,
    public dataService: DataService,
    public snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.isStillLoading = true;

    let user = await this.userDetailsService.getUserProfile();

    this.user = user;

    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    let communities = await this.httpService.getRequest(COMMUNITIES_URL, this.headerParams);

    communities.subscribe(
      communities => {
        this.isStillLoading = false;

        console.log('all communities------->', communities['data']);
        if (communities.hasOwnProperty('data') && this.user.hasOwnProperty('communities')) {
          for (let i = 0; i < communities['data'].length; i++) {
            let index = this.user['communities'].findIndex(community => community['_id'] === communities['data'][i]['_id']);
            if (index < 0) {
              communities['data'][i]['isSubscribed'] = false;
              this.communities.push(communities['data'][i]);
            }
          }
        }
      },
      err => {
        this.showErrorNotification(err, 'err', 'communities was not recevied: subscribe-a-community');
      }
    );
  }

  async subscribeACommunity(id: string) {
    console.log('comunity id----->', id);

    let userID = await this.userDetailsService.getUserID();

    let data = {
      subscriber: userID
    };

    let query = `?id=${id}`;

    let community = await this.httpService.patchRequest(`http://localhost:3030/update-community` + query, data, this.headerParams);

    community.subscribe(
      res => {
        console.log('community: subscribe----->', res);
        let index = this.communities.findIndex(community => community['_id'] === res['_id']);
        this.communities[index]['isSubscribed'] = true;

        this.dataService.shareID(id);
      },
      err => {
        console.log(err);
        this.showErrorNotification(err, 'err', 'community was not updated');
      }
    );
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
