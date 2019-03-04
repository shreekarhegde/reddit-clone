import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  constructor(public http: HttpService, public router: Router, public tokenService: TokenService) {}
  public isNextButtonClicked = false;
  public email;
  public username;
  public password;
  public usersUrl = 'http://localhost:3030/users';
  public authUrl = 'http://localhost:3030/authentication';

  ngOnInit() {}

  getUserEmail(f: NgForm): void {
    this.isNextButtonClicked = true;
    this.email = f.value.email ? f.value.email : null;
  }

  async post() {
    let userDetails = {
      email: this.email,
      username: this.username,
      password: this.password
    };
    await this.http.postRequest(this.usersUrl, userDetails).subscribe(
      user => {
        console.log('post: user-------->', user);
        this.http.postRequest(this.authUrl, { strategy: 'local', username: this.username, password: this.password }).subscribe(res => {
          if (res.hasOwnProperty('accessToken')) {
            console.log('from post subscribe success');
            // localStorage.setItem('user', JSON.stringify({ user: res }));
            this.tokenService.setToken(res);
            this.router.navigateByUrl('');
          }
        });
      },
      err => {
        console.log('post: err-------->', err);
      }
    );
  }

  backToEmail() {
    this.isNextButtonClicked = false;
  }
}
