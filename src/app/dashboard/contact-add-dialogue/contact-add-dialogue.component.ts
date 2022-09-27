import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-add-dialogue',
  templateUrl: './contact-add-dialogue.component.html',
  styleUrls: ['./contact-add-dialogue.component.scss']
})
export class ContactAddDialogueComponent implements OnInit {
  contactForm: any;

  constructor(public dialogRef: MatDialogRef<ContactAddDialogueComponent>,
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {

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
  }

  closeDialog() {
    this.dialogRef.close('');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.spinner.show();
      this.apiService.post('auth/contacts', this.contactForm.value).subscribe(
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
