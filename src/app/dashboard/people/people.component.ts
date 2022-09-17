import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  submitted: boolean=false;
  contacts: any=[];

  constructor(private apiService: ApiService,
    private router: Router,

    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
      this.spinner.show();
      this.apiService.get('auth/contacts').subscribe(
        (res) => {
         this.contacts = res.contacts;
         console.log(res.contacts);
         this.spinner.hide();
        },

        (err) => {
          this.toastr.error('Failed to fetch contacts!', 'Failed!');
          this.spinner.hide();
        }
      )
     }

  ngOnInit(): void {

  }

}
