import { Component, OnInit } from '@angular/core';
import { UserDetailsService } from '../../services/user-details.service';
@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  public usersUrl = 'http://localhost:3030/users';
  public profileName;

  constructor(public userDetailsService: UserDetailsService) {}

  ngOnInit() {
    this.userDetailsService
      .getUserProfile()
      .then(user => {
        console.log('user: addComment------>', user);
        if (user.hasOwnProperty('username')) {
          this.profileName = user['username'];
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}
