import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCommunityComponent } from './create-community/create-community.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateCommunityComponent],
  imports: [CommonModule, FormsModule]
})
export class CommunitiesModule {}
