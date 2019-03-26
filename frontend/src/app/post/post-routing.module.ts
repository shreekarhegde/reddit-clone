import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisplayPostComponent } from './display-post/display-post.component';
import { CreatePostComponent } from '../post/create-post/create-post.component';

const routes: Routes = [
  {
    path: '',
    children: [{ path: '', component: DisplayPostComponent }, { path: '', component: CreatePostComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule {}
