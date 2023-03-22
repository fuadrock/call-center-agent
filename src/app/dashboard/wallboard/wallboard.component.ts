import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { ScheduleService } from 'src/app/core/services/schedule.service';


@Component({
  selector: 'app-wallboard',
  templateUrl: './wallboard.component.html',
  styleUrls: ['./wallboard.component.scss']
})
export class WallboardComponent implements OnInit,OnDestroy {

  @ViewChild('peopleSearchInput' , { static: true }) peopleSearch:ElementRef;


  activeQueue: any;
  queues: any = [];
  peoples: any = [];
  subscribe: any;
  calls: any;
  queueData: any;
  callType:any={};
  slicedCalls:any=[];

  liveData :any;
  caller_status: any=[];

  subsctiption: Subscription;


  displayedColumns: string[] = ['agent', 'status', 'state', 'missed', 'answered','caller', 'duration' ];


  displayedColumnHistory: string[] = ['agent',  'destination', 'final', 'start', 'type', 'duration'];

  

  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private scheduler:ScheduleService) {

    this.getQueue();
   
  }

  ngOnInit(): void {
    this.subsctiption  = this.scheduler.getCallerStatus.subscribe(
      res=>{
        if(res){
          this.caller_status = res.data;
        }
      }
    )

      fromEvent(this.peopleSearch.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      filter(res => res.length > 1),
      debounceTime(500),
      distinctUntilChanged()).
      subscribe((text: string) => {

      this.spinner.show();
      this.subscribe = this.apiService.get('auth/peoples?search=' + text).subscribe(
        (res) => {
          this.peoples = [];
          this.peoples = res.peoples;
          this.spinner.hide();
        },

        (err) => {
          this.toastr.error('Failed to fetch peoples!', 'Failed!');
          this.spinner.hide();
        }
      )

    });

  }

  addToQueue(uid:any){
    this.spinner.show();
    let data = {agent_uuid:uid,queues:[{queue_uuid:this.activeQueue.name,level:0,position:0}]}
    this.apiService.post('auth/queue_login',data).subscribe(
      res => {
        this.toastr.success('Agent added to the queue!', 'Success!');

        this.spinner.hide();
       
      },
      err => {
        this.spinner.hide();
      });

  }

  getStatus(uid:any){
    this.spinner.show();
   // let pagination = '?pageNumber=1&pageSize=50&queue_uuid='+uid;
    this.apiService.get('auth/queue_realtime_callstatus/' + uid).
      subscribe(
        res => {

          this.spinner.hide();
          this.caller_status = res.data;
          // this.slicedCalls =  res.calls.slice(0,10);
          // this.callType = this.countCalls(res.calls);

        },
        err => {

          this.spinner.hide();
          this.toastr.error('Failed to fetch caller status', 'Failed!');
        }
      )
  }

  getQueue() {
    this.spinner.show();
    this.apiService.get('auth/queues').subscribe(
      res => {
        this.spinner.hide();
        this.queues = res.queues;
        this.activeQueue = res.queues[0];
        this.scheduler.queueID = res.queues[0]?.name;
        this.getAgents(res.queues[0]?.name);
        this.getCallsByQueue(res.queues[0]);
        this.getCalls(res.queues[0].name);
        this.getLiveData(res.queues[0].name);
       // this.getStatus(res.queues[0].name);
       this.scheduler.getRealTimeCallsStatus();
      },
      err => {
        this.spinner.hide();
      });
  }

  changeQueue(queue:any){
    this.activeQueue = queue;
    this.scheduler.queueID = queue.name;
    this.getCallsByQueue(queue);
    this.getCalls(queue.name);
    this.getLiveData(queue.name);
   // this.getStatus(queue.name);
    this.getAgents(queue.name);

  }

  getAgents(id:any) {

    if(!id){
      id=''
    }
    this.spinner.show();
    this.subscribe = this.apiService.get('auth/peoples?filter='+id).subscribe(
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

ngOnDestroy(): void {

  this.scheduler.stopRealTimeCallsStatus();
  if(this.subsctiption){
    this.subsctiption.unsubscribe();
  }

}


}

