import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserCommentsComponent } from './user-profile/user-comments/user-comments.component';
import { UserPostsComponent } from './user-profile/user-posts/user-posts.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: UserLoginComponent },
      { path: 'register', component: UserRegisterComponent },
      {
        path: ':id',
        canActivate: [AuthGuard],

        component: UserProfileComponent,
        children: [
          {
            path: 'comments',
            canActivate: [AuthGuard],
            component: UserCommentsComponent
          },
          {
            path: 'posts',
            canActivate: [AuthGuard],
            component: UserPostsComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
