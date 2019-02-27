import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavigationRoutingModule } from './navigation-routing.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, NavigationRoutingModule],
  exports: []
})
export class NavigationModule {}
