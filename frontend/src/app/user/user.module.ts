import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NavigationModule } from '../navigation/navigation.module';

@NgModule({
  declarations: [UserRegisterComponent, UserLoginComponent, UserProfileComponent],
  imports: [CommonModule, UserRoutingModule, FormsModule, MatSnackBarModule, NavigationModule],
  exports: []
})
export class UserModule {}
