import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MessageService } from '../community-details/message.service';

const COMMUNITY_URL = 'http://localhost:3030/communities';
@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.css']
})
export class CreateCommunityComponent implements OnInit {
  public title: string = '';
  public name: string = '';
  public description: string = '';
  constructor(
    public httpService: HttpService,
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public router: Router,
    public snackbar: MatSnackBar,
    public messageService: MessageService
  ) {}

  ngOnInit() {
    this.messageService.shareMessageValue(true);
  }

  async createCommunity() {
    let headerParmas = this.tokenService.checkTokenAndSetHeader();
    let data = {
      title: this.title,
      name: this.name ? this.name : this.nameMustBeAdded(),
      description: this.description
    };
    if (data['name'] && data['name']['length'] > 0) {
      this.httpService.postRequest(COMMUNITY_URL, data, headerParmas).subscribe(
        community => {
          this.router.navigate(['/r/communities', community['_id']]);
        },
        err => {
          this.showErrorNotification(err, 'err', 'community was not created');
        }
      );
    }
  }

  nameMustBeAdded() {
    this.showErrorNotification(null, 'warning', 'Name for a community is a must. Please give a name.');
  }

  showErrorNotification(err, type, message) {
    console.log('err:showErrorNotification: create-community-------> ', err);
    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }
}
