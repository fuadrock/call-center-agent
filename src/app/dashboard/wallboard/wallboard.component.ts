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
  callType:any={};
  slicedCalls:any=[];

  liveData :any;

  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,) {

    this.getQueue();
    this.getAgents();
    

  }

  ngOnInit(): void {

  }

  getQueue() {
    this.spinner.show();
    this.apiService.get('auth/queues').subscribe(
      res => {
        this.spinner.hide();
        this.queues = res.queues;
        this.activeQueue = res.queues[0];
        this.getCallsByQueue(res.queues[0]);
        this.getCalls(res.queues[0].name);
        this.getLiveData(res.queues[0].name);
      },
      err => {
        this.spinner.hide();
      });
  }

  changeQueue(queue:any){
    this.activeQueue = queue;
    this.getCallsByQueue(queue);
    this.getCalls(queue.name);
    this.getLiveData(queue.name);
  }

  getAgents() {
    this.spinner.show();
    this.subscribe = this.apiService.get('auth/peoples').subscribe(
      (res) => {
        this.spinner.hide();
        this.peoples = res.peoples;
      },

      (err) => {
        this.toastr.error('Failed to fetch peoples!', 'Failed!');
        this.spinner.hide();
      })
  }

  getCalls(uid:any) {

    this.spinner.show();
    let pagination = '?pageNumber=1&pageSize=50&queue_uuid='+uid;
    this.apiService.get('auth/calls' + pagination).
      subscribe(
        res => {

          this.spinner.hide();
          this.calls = res.calls;
          this.slicedCalls =  res.calls.slice(0,10);
          this.callType = this.countCalls(res.calls);

        },
        err => {

          this.spinner.hide();
          this.toastr.error('Failed to fetch calls!50', 'Failed!');
        }
      )
  }

  getCallsByQueue(queue: any) {
    
    this.spinner.show();
    this.apiService.get('auth/call-list-by-queue/' + queue.name).subscribe(
      res => {
        
    this.spinner.hide();
        this.queueData = res;
      },
      err => {

        this.spinner.hide();
      })
  }
  
  countCalls(arr: any) {
    var answered = 0;
    var missed = 0;
    var abandoned = 0;
    var failed = 0;
    var cancelled = 0
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].type === "Answered") {
        answered++;
      } else if (arr[i].type === "Missed") {
        missed++;
      } else if (arr[i].type === "Abandoned") {
        abandoned++;
      }else if (arr[i].type === "Failed") {
        failed++;
      }else if (arr[i].type === "Cancelled") {
        cancelled++;
      }
    }
    return { "missed": missed, "answered": answered, "abandoned": abandoned };
  }

  getLiveData(name:any){
    if(name){
    this.spinner.show();
    this.apiService.get('auth/queue_realtime/' + name).
      subscribe(
        res => {
          this.liveData = res.data;
          this.spinner.hide();
        },
        err => {
         
          this.spinner.hide();
          this.toastr.error('Failed to fetch callssss!', 'Failed!');
        }
      )
  }
}

}
