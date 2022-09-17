import { Q } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { CommunicationService } from 'src/app/core/services/communication.service';

@Component({
  selector: 'app-queue-login',
  templateUrl: './queue-login.component.html',
  styleUrls: ['./queue-login.component.scss']
})
export class QueueLoginComponent implements OnInit {

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings = {};

  submitted = false;

  constructor(private apiService: ApiService,
    private router: Router,
    private com: CommunicationService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.apiService.get('auth/queues').subscribe(
      res => {

        localStorage.setItem('queues', JSON.stringify(res.queues));
        this.dropdownList = res.queues;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'alias',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  submit() {
    this.submitted = true;
    if (this.selectedItems.length > 0) {
      this.spinner.show();
      let queues: any = { queues: [] }
      this.selectedItems.forEach((e: { name: any; alias: any }) => {
        let queue = { queue_uuid: e.name, level: "0", position: "0" };
        queues.queues.push(queue);

      });

      this.apiService.post('auth/queue_login', queues).subscribe(
        res => {

          localStorage.setItem("loggedInQueue", JSON.stringify(this.selectedItems));

          this.toastr.success('Login Success!', 'Success!');

          this.apiService.get('auth/profile').subscribe(
            res => {
              localStorage.setItem("profile",JSON.stringify(res.user));
              this.spinner.hide();
              localStorage.setItem('queue-login', "1");
              this.com.setProfile(res.user);
              this.router.navigate(['/dashboard/home']);

            },
            err => {
              this.toastr.error('Error receiving profile data!', 'Failed!');
              this.spinner.hide();
            }
          )

        },
        err => {
          this.toastr.error('Login failed!', 'Failed!');
          this.spinner.hide();
        }
      )

    }
    else {
      this.spinner.show();


      this.apiService.get('auth/profile').subscribe(
        res => {
          this.spinner.hide();
          localStorage.setItem('queue-login', "1");
          localStorage.setItem("profile",JSON.stringify(res.user));
          this.com.setProfile(res.user);
          this.router.navigate(['/dashboard/home']);
        },
        err => {
          this.spinner.hide();
          this.toastr.error('Error receiving profile data!', 'Failed!');
        }
      )

    }
  }
}
