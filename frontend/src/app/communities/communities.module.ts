import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCommunityComponent } from './create-community/create-community.component';
import { FormsModule } from '@angular/forms';
import { CommunityDetailsComponent } from './community-details/community-details.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CreateCommunityComponent, CommunityDetailsComponent],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CommunitiesModule {}
