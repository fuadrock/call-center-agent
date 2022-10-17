import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {

  calls: any;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginateStartNo = 0;

  page = 1;
  size = 10;
  pageLength = 0;
  pageSizeOptions = [5, 10, 15, 20];
  pageSort: any;
  filterForm: any;
  search: boolean = false;

  constructor(private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {

    this.filterForm = this.fb.group({
      direction: ['',],
      caller_id_number: ["",],
      caller_destination: ['',],
      destination_number: ["",],
      start_time: ["",],
      end_time: ["",],
      type: ["",],
    });

  }

  ngOnInit(): void {

    this.getCalls();
  }

  getCalls() {
    let queryparam = '';
    let pagination = `?pageNumber=${this.page}&pageSize=${this.size}`;
    if (this.search) {
      let filter = '';
      let query = this.filterForm.value;
      filter = `&direction=${query.direction}&caller_id_number=${query.caller_id_number}&caller_destination=${query.caller_destination}&destination_number=${query.destination_number}&start_time=${query.start_time}&end_time=${query.end_time}&type=${query.type}`
      queryparam = pagination + filter;
    }
    else {
      queryparam = pagination;
    }

    this.spinner.show();
    this.apiService.get('auth/calls' + queryparam).
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

  onPaginateChange(event: any) {

    this.size = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getCalls();
  }

  onSubmit() {
    this.search = true;
    this.getCalls();

  }
  clear() {
    this.search = false;
    this.filterForm.reset();
    this.getCalls();
  }
}
