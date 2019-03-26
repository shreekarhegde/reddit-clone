import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostModule } from '../post/post.module';
import { CommentsModule } from '../comments/comments.module';
import { CommunitiesModule } from '../communities/communities.module';
import { DataService } from '../services/data-service.service';
@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, PostModule, CommentsModule, CommunitiesModule],
  exports: [HomeComponent],
  providers: [DataService]
})
export class HomeModule {}
