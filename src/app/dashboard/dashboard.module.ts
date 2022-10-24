import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentComponent } from './agent/agent.component';
import { RouterModule, Routes } from '@angular/router';
import { PeopleComponent } from './people/people.component';
import { ChatComponent } from './chat/chat.component';
import { CallsComponent } from './calls/calls.component';
import { SettingComponent } from './setting/setting.component';
import { PanelComponent } from './panel/panel.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxSpinnerModule } from "ngx-spinner";
import { SafePipeModule } from 'safe-pipe';
import { ContactComponent } from './contact/contact.component';
import { ContactAddDialogueComponent } from './contact-add-dialogue/contact-add-dialogue.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteDialogueComponent } from './delete-dialogue/delete-dialogue.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { TimeagoClock, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';


const routes: Routes = [
  {
    path: 'home',
    component: AgentComponent
  },
  {
    path: 'extension',
    component: PeopleComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'call',
    component: CallsComponent
  },
  {
    path: 'setting',
    component: SettingComponent
  },
  {
    path: 'panel',
    component: PanelComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'contact-details/:id',
    component: ContactDetailsComponent
  }
]

@NgModule({
  declarations: [
    AgentComponent,
    ChatComponent,
    CallsComponent,
    SettingComponent,
    PeopleComponent,
    PanelComponent,
    ContactComponent,
    ContactAddDialogueComponent,
    DeleteDialogueComponent,
    ContactDetailsComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    SafePipeModule,
    NgbDropdownModule,
    FeatherModule.pick(allIcons),
    TimeagoModule.forChild()
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ContactAddDialogueComponent,DeleteDialogueComponent]
})
export class DashboardModule { }
