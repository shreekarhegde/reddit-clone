import { Injectable } from '@angular/core';
import { CanActivate, Router, Route } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  public _accessToken: string = '';
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    this._accessToken = this.tokenService.getToken()['user']['accessToken']
      ? this.tokenService.getToken()['user']['accessToken']
      : this.tokenService.getToken()['user'];

    if (this._accessToken['length'] > 0) {
      console.log('*******token exists*****');
      return true;
    }
    this.router.navigate(['/users/login']);
    return false;
  }
}
