import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public userID: string = '';
  constructor(public router: Router, public dataService: DataService) {}

  ngOnInit() {
    this.dataService.subscribedID$.subscribe(
      id => {
        this.userID = id;
      },
      err => {
        console.log('err:user-profile', err);
      }
    );
  }

  gotoPosts() {
    this.router.navigate([`/users/${this.userID}/posts`]);
  }

  gotoComments() {
    console.log('userId goto comments', this.userID);
    this.router.navigate([`/users/${this.userID}/comments`]);
  }
}
