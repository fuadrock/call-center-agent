import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-add-dialogue',
  templateUrl: './contact-add-dialogue.component.html',
  styleUrls: ['./contact-add-dialogue.component.scss']
})
export class ContactAddDialogueComponent implements OnInit {
  contactForm: any;
  editData:any;

  constructor(public dialogRef: MatDialogRef<ContactAddDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
      this.editData = data;

    this.contactForm = this.fb.group({
      type: ["", [Validators.required]],
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      organization: ['', [Validators.required]],
      role: ["", [Validators.required]],
      email: ['', [Validators.required]],
      timezone: ["", [Validators.required]],

      work_phone: ["", [Validators.required]],
      extension: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
    });

  }

  ngOnInit(): void {
    if(this.editData){
      this.contactForm.setValue({
        type: this.editData.type,
        first_name: this.editData.first_name,
        last_name: this.editData.last_name,
        organization:this.editData.organization,
        role: this.editData.role,
        email: this.editData.email,
        timezone:this.editData.timezone,

        work_phone: this.editData.work_phone,
        extension: this.editData.extension,
        mobile: this.editData.mobile,
     });

    }
  }

  closeDialog() {
    this.dialogRef.close('');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.spinner.show();
      let formdata = this.contactForm.value;
      if(this.editData){
        formdata.id = this.editData.id;
      }
      this.apiService.post('auth/contacts', formdata).subscribe(
        res => {
          this.spinner.hide();
          this.toastr.success('Adding contact successful!', 'Success!');
          this.dialogRef.close('add');

        },
        err=>{
          this.spinner.hide();
          this.toastr.error('Failed to add contacts!', 'Failed!');
        }
      )
    }
  }
}
