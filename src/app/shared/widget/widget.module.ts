import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { UserComponent } from './user/user.component';
import { ChannelsComponent } from './channels/channels.component';

@NgModule({
  declarations: [
    UserComponent,
    ChannelsComponent
  ],
  imports: [
    CommonModule,
    NgbDropdownModule
  ],
  exports: [UserComponent, ChannelsComponent]
})
export class WidgetModule { }
