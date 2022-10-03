import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {

  calls:any;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginateStartNo = 0;

  page = 1;
  size = 10;
  pageLength = 0;
  pageSizeOptions = [5, 10, 15, 20];
  pageSort:any;

  constructor(private apiService: ApiService,
    private router: Router,

    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.getCalls();
  }

  getCalls(){
    let pagination = `?pageNumber=${this.page}&pageSize=${this.size}`;
    this.spinner.show();
    this.apiService.get('auth/calls'+pagination).
    subscribe(
      res => {
       this.calls = res.calls;
       this.pageLength = res.total;
        this.spinner.hide();

      },
      err => {
        this.spinner.hide();
        this.toastr.error('Failed to fetch calls!', 'Failed!');

      }
    )
  }

  onPaginateChange(event:any) {
    console.log(event);
    this.size = event.pageSize;
    this.page = event.pageIndex+1;
    this.getCalls();
  }

}
