import { Injectable } from '@angular/core';
import { BehaviorSubject, of, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

   queueID = ''
   public callerStatus = new BehaviorSubject<any>('');
   getCallerStatus = this.callerStatus.asObservable();
   callerStatus_subscription: any;

  public eventData = new BehaviorSubject<any>('');
  getEventData = this.eventData.asObservable();
  queue_subscription: any;

  public callData = new BehaviorSubject<any>('');
  getCallsData = this.callData.asObservable();
  call_subscription: any;

  constructor(private apiService:ApiService) { }


  getEventLog() {

    this.queue_subscription = timer(0, 10000).pipe(
      switchMap(() => this.apiService.get('auth/get_queues' ).pipe(catchError(x => of(
        console.log("error: ", x)
      ))))
    ).subscribe(res => {

      this.eventData.next(res);
    },
      err => {
        this.eventData.next(null);
      });
  }

  getWallboard(queue:any){
    this.call_subscription = timer(0, 10000).pipe(
      switchMap(() => this.apiService.get('auth/queue_realtime/'+queue).pipe(catchError(x => of(
        console.log("error: ", x)
      ))))
    ).subscribe(res => {

      this.callData.next(res);
    },
      err => {
        this.callData.next(null);
      });
  }

  stopEventLog() {
    if (this.queue_subscription) {
      this.queue_subscription.unsubscribe();
    }
  }

  getRealTimeCallsStatus(){
    if(this.queueID){
    this.callerStatus_subscription = timer(0, 5000).pipe(
      switchMap(() => this.apiService.get('auth/queue_realtime_callstatus/'+this.queueID).pipe(catchError(x => of(
        console.log("error: ", x)
      ))))
    ).subscribe(res => {

      this.callerStatus.next(res);
    },
      err => {
        this.callerStatus.next(null);
      });
    }
  }

  stopRealTimeCallsStatus() {
    if (this.callerStatus_subscription) {
      this.callerStatus_subscription.unsubscribe();
    }
  }
}
