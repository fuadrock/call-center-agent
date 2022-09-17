import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  year: number = new Date().getFullYear();
  loginForm: any;
  isLoading: any = false;
  submit: boolean = false;

  constructor(private apiService: ApiService,
    private router: Router,
    private storage: StorageService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
      localStorage.clear();
     }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],

    });
  }

  redirect() {
    this.router.navigate(['/dashboard/home'])
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submit = true;
    console.log(this.form);
    if (this.loginForm.valid) {
      this.spinner.show();

      this.apiService.login('auth/login', this.loginForm.value).subscribe(
        res => {
          this.storage.setAccessToken(res.access_token);
          localStorage.setItem("password",this.loginForm.value.password);
          this.router.navigate(['/auth/queue-login']);
          this.toastr.success('Login Success!', 'Success!');
          this.spinner.hide();

        },
        err => {
          this.spinner.hide();
          this.toastr.error('Login failed!', 'Failed!');


        }
      )
    }
  }

}
