import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserCommentsComponent } from './user-profile/user-comments/user-comments.component';
import { UserPostsComponent } from './user-profile/user-posts/user-posts.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: UserLoginComponent },
      { path: 'register', component: UserRegisterComponent },
      {
        path: ':id',
        component: UserProfileComponent,
        children: [{ path: 'comments', component: UserCommentsComponent }, { path: 'posts', component: UserPostsComponent }]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
