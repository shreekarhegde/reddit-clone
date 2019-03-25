import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { ShowCommentsComponent } from './show-comments/show-comments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddCommentComponent, ShowCommentsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class CommentsModule {}
