import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';

const routes: Routes = [
  {
    path: '',
    children: [{ path: '', component: TopNavigationComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule {}
