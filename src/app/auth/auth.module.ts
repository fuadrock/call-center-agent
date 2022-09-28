import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { QueueLoginComponent } from './queue-login/queue-login.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'queue-login', component: QueueLoginComponent },

];

@NgModule({
  declarations: [
    LoginComponent,
    QueueLoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AuthModule { }
