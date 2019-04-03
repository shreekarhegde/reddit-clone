import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {
  public userName: string = '';
  public userID: any = '';
  constructor(
    public httpService: HttpService,
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public snackbar: MatSnackBar,
    public router: Router
  ) {}

  async ngOnInit() {
    let usersUrl = 'http://localhost:3030/users';
    let headerParams = this.tokenService.checkTokenAndSetHeader();
    this.userID = await this.userDetailsService.getUserID();
    this.httpService.getRequest(`${usersUrl}/${this.userID}`, headerParams).subscribe(
      res => {
        this.userName = res['username'];
      },
      err => {
        this.showNotification(err, 'err', 'could not receive user name');
      }
    );
  }

  onChange(event) {
    if (event['target']['value'] === 'My profile') {
      this.router.navigate(['', 'users', this.userID, 'comments']);
    }
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
