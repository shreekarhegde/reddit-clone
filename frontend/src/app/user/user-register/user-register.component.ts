import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { MatSnackBar } from '@angular/material';

const USERS_URL = 'http://localhost:3030/api/users';
const AUTH_URL = 'http://localhost:3030/api/authentication';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  public isNextButtonClicked: boolean = false;
  public email: string = '';
  public password: string = '';
  public isStillLoading: boolean = false;
  public emailPattern = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$');
  public passwordPattern = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
  public username: string = '';
  public showPassword: boolean = false;
  constructor(public http: HttpService, public router: Router, public tokenService: TokenService, public snackbar: MatSnackBar) {}

  ngOnInit() {}

  getUserEmail(f: NgForm): void {
    this.email = f.value.email ? f.value.email : null;
    console.log(f.value.email);
    if (this.emailPattern.test(this.email)) {
      this.isNextButtonClicked = true;
    }
  }

  sendUserDetails(f: NgForm) {
    let userDetails = {};
    this.username = f.value.username;
    this.password = f.value.password;
    console.log(this.password);

    console.log(this.passwordPattern.test(this.password));
    if (this.passwordPattern.test(this.password)) {
      userDetails = {
        email: this.email,
        username: this.username,
        password: this.password
      };
      console.log(userDetails);
      this.isStillLoading = true;

      this.http.postRequest(USERS_URL, userDetails, null).subscribe(
        user => {
          console.log('post: user-------->', user);
          this.http.postRequest(AUTH_URL, { strategy: 'local', username: this.username, password: this.password }, null).subscribe(res => {
            if (res) {
              this.isStillLoading = false;
              console.log('res from register', res);
              this.tokenService.setToken(res);
              this.router.navigateByUrl('r');
            }
          });
        },
        err => {
          if (err['statusText'] === 'Conflict') {
            this.isStillLoading = false;

            this.showNotification(err, 'err', 'This user name is already taken. Please choose a different username.');
          }
        }
      );
    }
  }

  backToEmail() {
    this.isNextButtonClicked = false;
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

  showNotification(err, type, message) {
    console.log(err, 'err: show notification: user-register------->', err);
    const snackbarRef = this.snackbar.open(message, 'OK', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [type]
    });
  }
}
