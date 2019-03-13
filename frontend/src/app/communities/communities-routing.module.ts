import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreateCommunityComponent } from './create-community/create-community.component';

const routes: Routes = [
  {
    path: '',
    children: [{ path: '', component: CreateCommunityComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
