import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { ShowCommentsComponent } from './show-comments/show-comments.component';

@NgModule({
  declarations: [AddCommentComponent, ShowCommentsComponent],
  imports: [CommonModule]
})
export class CommentsModule {}
