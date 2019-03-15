import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreateCommunityComponent } from './create-community/create-community.component';
import { CommunityDetailsComponent } from './community-details/community-details.component';

const routes: Routes = [
  {
    path: '',
    children: [{ path: '', component: CreateCommunityComponent }, { path: '/:id', component: CommunityDetailsComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
