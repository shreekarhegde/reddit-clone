import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostModule } from '../post/post.module';
import { CommentsModule } from '../comments/comments.module';
import { CommunitiesModule } from '../communities/communities.module';
import { DataService } from '../services/data-service.service';
import { NavigationModule } from '../navigation/navigation.module';
// import { AuthGuardService } from '../services/auth-guard.service';
@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, PostModule, CommentsModule, CommunitiesModule, NavigationModule],
  exports: [HomeComponent],
  providers: [DataService]
})
export class HomeModule {}
