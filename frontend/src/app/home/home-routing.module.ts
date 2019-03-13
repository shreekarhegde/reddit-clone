import { Routes, RouterModule, RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { DisplayPostComponent } from '../post/display-post/display-post.component';
import { AddCommentComponent } from '../comments/add-comment/add-comment.component';
import { CreateCommunityComponent } from '../communities/create-community/create-community.component';
import { SubscribeACommunityComponent } from '../communities/subscribe-a-community/subscribe-a-community.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: DisplayPostComponent },
      { path: '', component: SubscribeACommunityComponent },
      { path: 'comments/:id', component: AddCommentComponent },
      { path: 'communities', component: CreateCommunityComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [RouterOutlet]
})
export class HomeRoutingModule {}
