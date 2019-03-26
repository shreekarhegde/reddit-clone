import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'users/login', pathMatch: 'full' },
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: './layout/layout.module#LayoutModule'
      }
    ]
  },
  { path: 'users', loadChildren: './user/user.module#UserModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
