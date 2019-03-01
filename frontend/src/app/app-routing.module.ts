import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    // loadChildren: './layout/layout.module#LayoutModule'
    children: [
      {
        path: '',
        loadChildren: './layout/layout.module#LayoutModule'
        // component: LayoutComponent,
        // children: [{ path: '', loadChildren: '../home/home.module#HomeModule' }]
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
