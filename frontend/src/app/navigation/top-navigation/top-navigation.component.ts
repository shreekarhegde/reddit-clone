import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import { UserDetailsService } from 'src/app/services/user-details.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {
  public userName;
  constructor(public httpService: HttpService, public tokenService: TokenService, public userDetailsService: UserDetailsService) {}

  async ngOnInit() {
    let usersUrl = 'http://localhost:3030/users';
    let headerParams = await this.tokenService.checkTokenAndSetHeader();
    let userID = this.userDetailsService.getUserID();
    this.httpService.getRequest(`${usersUrl}/${userID}`, headerParams).subscribe(res => {
      this.userName = res['username'];
    });
  }
}
