import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  peoples: any = [];
  subscribe: Subscription;
  random:number=this.getRandomInt();
  total: any=0;


  constructor(private apiService: ApiService,
    private router: Router,

    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {


    this.spinner.show();
    this.subscribe = this.apiService.get('auth/peoples').subscribe(
      (res) => {
        this.peoples = res.peoples;
        this.total = res.peoples.length;
        this.spinner.hide();
      },

      (err) => {
        this.toastr.error('Failed to fetch peoples!', 'Failed!');
        this.spinner.hide();
      }
    )
  }

  ngOnInit(): void {

  }

  getRandomInt() {
    return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

}
