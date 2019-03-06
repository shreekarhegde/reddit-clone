import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostModule } from '../post/post.module';
import { CommentsModule } from '../comments/comments.module';
@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, PostModule, CommentsModule],
  exports: [HomeComponent],
  providers: []
})
export class HomeModule {}
