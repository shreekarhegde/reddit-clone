import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { NavigationRoutingModule } from './navigation-routing.module';
import { ViewFiltersComponent } from './view-filters/view-filters.component';
import { MatSnackBarModule, MatSelectModule, MatFormFieldModule } from '@angular/material';

@NgModule({
  declarations: [TopNavigationComponent, ViewFiltersComponent],
  imports: [CommonModule, NavigationRoutingModule, MatSnackBarModule, MatSelectModule, MatFormFieldModule],
  exports: [TopNavigationComponent]
})
export class NavigationModule {}
