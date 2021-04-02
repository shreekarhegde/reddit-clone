import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

const USERS_URL = 'http://localhost:3030/api/authentication';
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  public username: string = '';
  public password: string = '';
  public isStillLoading: boolean = false;
  public showPassword: boolean = false;

  constructor(private http: HttpService, private router: Router, private tokenService: TokenService, public snackbar: MatSnackBar) {}

  ngOnInit() {}

  login() {
    let data = { strategy: 'local', username: this.username, password: this.password };
    this.isStillLoading = true;
    if (this.username && this.password) {
      this.http.postRequest(USERS_URL, data, null).subscribe(
        user => {
          if (user.hasOwnProperty('accessToken') && user['accessToken']['length'] > 10) {
            console.log('user from login------>', user);
            this.isStillLoading = false;
            this.tokenService.setToken(user['accessToken']);

            this.showNotification(null, 'success', 'logged in successfully');

            this.router.navigate(['r']);
          }
        },
        err => {
          this.isStillLoading = false;

          this.showNotification(err, 'err', 'login failed. Please enter valid user name and password');
        }
      );
    } else {
      this.isStillLoading = false;

      this.showNotification(null, 'err', 'Please enter valid user name and password');
    }
  }

  showHidePassword() {
    console.log('here');
    this.showPassword = !this.showPassword;
  }

  showNotification(err, type, message) {
    console.log(err, 'err: show notification: user-login------->', err);
    const snackbarRef = this.snackbar.open(message, 'OK', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }
}
