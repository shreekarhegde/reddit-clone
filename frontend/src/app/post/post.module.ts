import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayPostComponent } from './display-post/display-post.component';
import { PostRoutingModule } from './post-routing.module';
@NgModule({
  declarations: [DisplayPostComponent],
  imports: [CommonModule, PostRoutingModule],
  exports: []
})
export class PostModule {}
