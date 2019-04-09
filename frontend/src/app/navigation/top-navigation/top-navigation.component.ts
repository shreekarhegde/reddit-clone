import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { FilterService } from './filter.service';

const USERS_URL = 'http://localhost:3030/users';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {
  public userName: string = '';
  private userID: any = '';
  public selected: string = 'Home';

  constructor(
    public httpService: HttpService,
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public snackbar: MatSnackBar,
    public router: Router,
    public filterService: FilterService
  ) {}

  async ngOnInit() {
    let headerParams = this.tokenService.checkTokenAndSetHeader();
    this.userID = await this.userDetailsService.getUserID();
    this.httpService.getRequest(`${USERS_URL}/${this.userID}`, headerParams).subscribe(
      res => {
        this.userName = res['username'];
      },
      err => {
        this.showNotification(err, 'err', 'could not receive user name');
      }
    );
  }

  onChange(event) {
    this.selected = event['value'];

    if (event['value'] === 'My profile') {
      this.router.navigate(['', 'users', this.userID, 'comments']);
    } else if (event['value'] === 'Logout') {
      localStorage.clear();
      this.showNotification(null, 'success', 'Logged out successfully');
      this.router.navigate(['', 'users', 'login']);
    }
  }

  onChangeFilter(event) {
    this.filterService.shareFilterValue(event['value']);
  }

  showNotification(err, type, message) {
    console.log(err, 'err: show notification: top-navigation------->', err);
    const snackbarRef = this.snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }
}
