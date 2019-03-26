import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  public username: string = '';
  public password: string = '';
  public isLoggedIn: boolean = false;

  constructor(private http: HttpService, private router: Router, private tokenService: TokenService, public snackbar: MatSnackBar) {}

  ngOnInit() {}

  login() {
    let url = 'http://localhost:3030/authentication';
    let data = { strategy: 'local', username: this.username, password: this.password };
    if (this.username && this.password) {
      this.http.postRequest(url, data, null).subscribe(
        user => {
          if (user.hasOwnProperty('accessToken')) {
            console.log('user from login------>', user);
            this.tokenService.setToken(user['accessToken']);
            const snackbarRef = this.snackbar.open('Login successfull!', '', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: 'login-snackbar'
            });
            this.router.navigate(['r']);
          }
        },
        err => {
          console.log('error from login----->', err);
          const snackbarRef = this.snackbar.open('login failed', 'Try again', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: 'login-snackbar'
          });
        }
      );
    } else {
      console.log('enter valid username and password');

      const snackbarRef = this.snackbar.open('Please enter valid user name and password', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: 'login-snackbar'
      });
    }
  }
}
