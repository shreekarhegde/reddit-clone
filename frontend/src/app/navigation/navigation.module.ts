import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { NavigationRoutingModule } from './navigation-routing.module';
import { ViewFiltersComponent } from './view-filters/view-filters.component';
import { MatSnackBarModule } from '@angular/material';

@NgModule({
  declarations: [TopNavigationComponent, ViewFiltersComponent],
  imports: [CommonModule, NavigationRoutingModule, MatSnackBarModule],
  exports: [TopNavigationComponent]
})
export class NavigationModule {}
