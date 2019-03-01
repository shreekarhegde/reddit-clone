import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { NavigationRoutingModule } from './navigation-routing.module';
import { ViewFiltersComponent } from './view-filters/view-filters.component';

@NgModule({
  declarations: [TopNavigationComponent, ViewFiltersComponent],
  imports: [CommonModule, NavigationRoutingModule],
  exports: [TopNavigationComponent]
})
export class NavigationModule {}
