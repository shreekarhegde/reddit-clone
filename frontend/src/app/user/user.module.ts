import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NavigationModule } from '../navigation/navigation.module';
import { UserPostsComponent } from './user-profile/user-posts/user-posts.component';
import { UserCommentsComponent } from './user-profile/user-comments/user-comments.component';

@NgModule({
  declarations: [UserRegisterComponent, UserLoginComponent, UserProfileComponent, UserPostsComponent, UserCommentsComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    MatSnackBarModule,
    NavigationModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  exports: []
})
export class UserModule {}
