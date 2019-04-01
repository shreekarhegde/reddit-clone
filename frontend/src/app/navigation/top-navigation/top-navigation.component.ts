import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {
  public userName: string = '';
  constructor(
    public httpService: HttpService,
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    let usersUrl = 'http://localhost:3030/users';
    let headerParams = this.tokenService.checkTokenAndSetHeader();
    this.userDetailsService
      .getUserID()
      .then(res => {
        let userID = res;
        this.httpService.getRequest(`${usersUrl}/${userID}`, headerParams).subscribe(
          res => {
            this.userName = res['username'];
          },
          err => {
            this.showNotification(err, 'err', 'could not receive user name');
          }
        );
      })
      .catch(err => {
        this.showNotification(err, 'err', 'could not revceive user name');
      });
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
