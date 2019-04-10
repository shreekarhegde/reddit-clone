import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NavigationModule } from '../navigation/navigation.module';
import { LayoutRoutingModule } from './layout-routing.moule';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, LayoutRoutingModule, NavigationModule, RouterModule]
})
export class LayoutModule {}
