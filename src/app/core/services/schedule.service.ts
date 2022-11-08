import { Injectable } from '@angular/core';
import { BehaviorSubject, of, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  public eventData = new BehaviorSubject<any>('');
  getEventData = this.eventData.asObservable();
  event_log_subscription: any;

  constructor(private apiService:ApiService) { }


  getEventLog() {

    this.event_log_subscription = timer(0, 10000).pipe(
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

  stopEventLog() {
    if (this.event_log_subscription) {
      this.event_log_subscription.unsubscribe();
    }
  }
}
