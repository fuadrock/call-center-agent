import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {

  calls:any;

  constructor(private apiService: ApiService,
    private router: Router,

    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.apiService.get('auth/calls').
    subscribe(
      res => {
       this.calls = res.calls;

        this.spinner.hide();

      },
      err => {
        this.spinner.hide();
        this.toastr.error('Failed to fetch calls!', 'Failed!');

      }
    )
  }

}
