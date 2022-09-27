import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {  Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommunicationService } from 'src/app/core/services/communication.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  profileForm: any;
  isLoading: any = false;
  submit: boolean = false;
  profile:any;
  subscrition: Subscription;

  constructor(private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private com:CommunicationService) {

      this.profileForm = this.fb.group({
        email: ['', [Validators.required]],
        name: ["", [Validators.required]],
        phone_number: ['', [Validators.required]],
        designation: ["", [Validators.required]],
        description: ["", [Validators.required]],
        location: ["", [Validators.required]],
      });

     }

  ngOnInit(): void {
   this.profile = JSON.parse(localStorage.getItem("profile") || '{}');


        this.profileForm.patchValue({

          email: this.profile.email,
          name:this.profile.name,
          phone_number: this.profile.agent.phone_number,
          designation: this.profile.agent.designation,
          description: this.profile.agent.description,
          location: this.profile.agent.location
        });


  }


  onSubmit(){
    this.submit = true;
    console.log(this.profileForm);
    if (this.profileForm.valid) {
      this.spinner.show();

      this.apiService.post('auth/profile_update', this.profileForm.value).subscribe(
        res => {
          this.profile = res.user;
          this.com.setProfile(res.user);
          localStorage.setItem("profile",JSON.stringify(res.user));
          this.toastr.success('Profile update successful!', 'Success!');
          this.spinner.hide();

        },
        err => {
          this.spinner.hide();
          this.toastr.error('Update failed!', 'Failed!');


        }
      )
    }
  }

}
