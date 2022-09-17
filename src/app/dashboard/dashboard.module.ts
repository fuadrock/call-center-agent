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

const routes: Routes = [
  {
    path: 'home',
    component: AgentComponent
  },
  {
    path: 'people',
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
  }
]

@NgModule({
  declarations: [
    AgentComponent,
    ChatComponent,
    CallsComponent,
    SettingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    SafePipeModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
