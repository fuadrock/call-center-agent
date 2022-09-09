import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  year: number = new Date().getFullYear();
  loginForm: any;

  constructor(private apiService:ApiService,
    private router: Router,
    private storage:StorageService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(8)]],

    });
  }

  redirect() {
    this.router.navigate(['/dashboard/home'])
  }
onSubmit(){
  this.apiService.login('auth/login',this.loginForm.value).subscribe(
    res=>{
      this.storage.setAccessToken(res.access_token);
      this.router.navigate(['/dashboard/home'])
    },
    err=>{

    }
  )
}

}
