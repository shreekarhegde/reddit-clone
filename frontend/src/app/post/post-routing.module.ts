import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisplayPostComponent } from './display-post/display-post.component';

const routes: Routes = [
  {
    path: '',
    children: [{ path: '', component: DisplayPostComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule {}
