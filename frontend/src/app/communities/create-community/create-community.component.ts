import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { TokenService } from 'src/app/services/token.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.css']
})
export class CreateCommunityComponent implements OnInit {
  public title;
  public name;
  public description;
  public communityUrl = 'http://localhost:3030/communities';
  constructor(
    public httpService: HttpService,
    public tokenService: TokenService,
    public userDetailsService: UserDetailsService,
    public router: Router
  ) {}

  ngOnInit() {}

  async createCommunity() {
    let headerParmas = await this.tokenService.checkTokenAndSetHeader();
    let data = {
      title: this.title,
      name: this.name,
      description: this.description
    };
    if (data) {
      this.httpService.postRequest(this.communityUrl, data, headerParmas).subscribe(
        community => {
          this.router.navigate(['/communities', community['_id']]);
          console.log(community);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}
