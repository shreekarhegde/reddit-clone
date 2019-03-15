import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// import { AddCommentComponent } from './add-comment/add-comment.component';
// import { ShowCommentsComponent } from './show-comments/show-comments.component';

const routes: Routes = [
  //not making any difference
  // {
  //   path: '',
  //   children: [{ path: '', component: AddCommentComponent }, { path: '', component: ShowCommentsComponent }]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
