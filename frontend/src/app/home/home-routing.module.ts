import { Routes, RouterModule, RouterOutlet, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { DisplayPostComponent } from '../post/display-post/display-post.component';
import { AddCommentComponent } from '../comments/add-comment/add-comment.component';
import { CreateCommunityComponent } from '../communities/create-community/create-community.component';
import { SubscribeACommunityComponent } from '../communities/subscribe-a-community/subscribe-a-community.component';
import { CommunityDetailsComponent } from '../communities/community-details/community-details.component';
import { CreatePostComponent } from '../post/create-post/create-post.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: 'r',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      { path: '', component: DisplayPostComponent },
      { path: '', component: SubscribeACommunityComponent },
      { path: 'submit', component: CreatePostComponent },
      { path: 'comments/:id', component: AddCommentComponent },
      { path: 'communities', component: CreateCommunityComponent },
      { path: 'communities/:id', component: CommunityDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [RouterOutlet]
})
export class HomeRoutingModule {}
