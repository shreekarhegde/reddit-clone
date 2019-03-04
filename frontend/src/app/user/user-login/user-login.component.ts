import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  public username;
  public password;
  public isLoggedIn = false;

  constructor(private http: HttpService, private router: Router, private tokenService: TokenService) {}

  ngOnInit() {}

  login() {
    let url = 'http://localhost:3030/authentication';
    let data = { strategy: 'local', username: this.username, password: this.password };
    if (this.username && this.password) {
      this.http.postRequest(url, data).subscribe(
        user => {
          if (user.hasOwnProperty('accessToken')) {
            console.log('user from login------>', user);
            this.tokenService.setToken(user['accessToken']);
            this.router.navigate(['']);
          }
        },
        err => {
          console.log('login:----> err', err);
        }
      );
    } else {
      console.log('enter valid username and password');
    }
  }
}
