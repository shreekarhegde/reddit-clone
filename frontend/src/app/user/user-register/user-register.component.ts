import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  constructor(public http: HttpService, public router: Router, public tokenService: TokenService, public snackbar: MatSnackBar) {}
  public isNextButtonClicked: boolean = false;
  public email: string = '';
  public username: string = '';
  public password: string = '';
  public usersUrl: string = 'http://localhost:3030/users';
  public authUrl: string = 'http://localhost:3030/authentication';

  ngOnInit() {}

  getUserEmail(f: NgForm): void {
    this.isNextButtonClicked = true;
    this.email = f.value.email ? f.value.email : null;
  }

  async sendUserDetails() {
    let userDetails = {
      email: this.email,
      username: this.username,
      password: this.password
    };

    await this.http.postRequest(this.usersUrl, userDetails, null).subscribe(
      user => {
        console.log('post: user-------->', user);
        this.http
          .postRequest(this.authUrl, { strategy: 'local', username: this.username, password: this.password }, null)
          .subscribe(res => {
            if (res) {
              console.log('res from register', res);
              this.tokenService.setToken(res);
              this.router.navigateByUrl('r');
            }
          });
      },
      err => {
        this.showNotification(err, 'err', 'please choose a user name and password');
      }
    );
  }

  backToEmail() {
    this.isNextButtonClicked = false;
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
