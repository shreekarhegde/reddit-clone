import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayPostComponent } from './display-post/display-post.component';
import { PostRoutingModule } from './post-routing.module';
import { CreatePostComponent } from './create-post/create-post.component';
import { FormsModule } from '@angular/forms';
import { SubscribeACommunityComponent } from '../communities/subscribe-a-community/subscribe-a-community.component';
@NgModule({
  declarations: [DisplayPostComponent, CreatePostComponent, SubscribeACommunityComponent],
  imports: [CommonModule, PostRoutingModule, FormsModule],
  exports: []
})
export class PostModule {}
