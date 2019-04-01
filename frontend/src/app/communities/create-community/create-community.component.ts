import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.css']
})
export class CreateCommunityComponent implements OnInit {
  public title: string = '';
  public name: string = '';
  public description: string = '';
  public communityUrl: string = 'http://localhost:3030/communities';
  constructor(
    public httpService: HttpService,
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public router: Router,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit() {}

  async createCommunity() {
    let headerParmas = this.tokenService.checkTokenAndSetHeader();
    let data = {
      title: this.title,
      name: this.name,
      description: this.description
    };
    if (data) {
      this.httpService.postRequest(this.communityUrl, data, headerParmas).subscribe(
        community => {
          this.router.navigate(['/r/communities', community['_id']]);
        },
        err => {
          this.showErrorNotification(err, 'err', 'community was not posted: create-community');
        }
      );
    }
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
