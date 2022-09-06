import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  year: number = new Date().getFullYear();

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  redirect(){
    this.router.navigate(['/dashboard/home'])
  }
}
