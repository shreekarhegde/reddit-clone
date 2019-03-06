import { Routes, RouterModule, RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { DisplayPostComponent } from '../post/display-post/display-post.component';
import { CreatePostComponent } from '../post/create-post/create-post.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [{ path: '', component: DisplayPostComponent }, { path: 'submit', component: CreatePostComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [RouterOutlet]
})
export class HomeRoutingModule {}
