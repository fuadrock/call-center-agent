import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';


@Component({
  selector: 'app-wallboard',
  templateUrl: './wallboard.component.html',
  styleUrls: ['./wallboard.component.scss']
})
export class WallboardComponent implements OnInit {

  activeQueue: any;
  queues: any = [];
  peoples: any = [];
  subscribe: any;
  calls: any;
  queueData: any;

  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,) {

    this.getQueue();
    this.getAgents()

  }

  ngOnInit(): void {

  }

  getQueue() {
    this.apiService.get('auth/queues').subscribe(
      res => {

        this.queues = res.queues;
        this.activeQueue = res.queues[0];
        this.getCallsByQueue(res.queues[0]);

      },
      err => {

      }
    );
  }

  getAgents() {

    this.subscribe = this.apiService.get('auth/peoples').subscribe(
      (res) => {
        console.log("peoples", res);
        this.peoples = res.peoples;
      },

      (err) => {
        this.toastr.error('Failed to fetch peoples!', 'Failed!');
        this.spinner.hide();
      }
    )
  }

  getCalls() {

    let pagination = `?pageNumber=0&pageSize=50`;
    this.apiService.get('auth/calls' + pagination).
      subscribe(
        res => {
          this.calls = res.calls;

        },
        err => {
          this.toastr.error('Failed to fetch calls!', 'Failed!');
        }
      )
  }

  getCallsByQueue(queue: any) {
    this.activeQueue = queue;

    this.apiService.get('auth/call-list-by-queue/' + queue.name).subscribe(
      res => {
        this.queueData = res;
      },
      err => {

      })
  }

  countCalls(arr: any) {
    var answered = 0;
    var missed = 0;
    var abandoned = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].type === "Answered") {
        answered++;
      } else if (arr[i].type === "Missed") {
        missed++;
      } else if (arr[i].type === "Abandoned") {
        abandoned++;
      }
    }
    return {"Missed":missed,"answered":answered,"abandoned":abandoned};
  }

}
