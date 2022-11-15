import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {


  public profile = new BehaviorSubject<any>('');
  getProfile = this.profile.asObservable();


  public loggedInQueues = new BehaviorSubject<any>('');
  getloggedInQueues = this.loggedInQueues.asObservable();


  public call = new BehaviorSubject<any>('');
  getCall = this.call.asObservable();

  constructor() { }

  setProfile(data:any){
    this.profile.next(data);
  }

  openCall(data:any){
    this.call.next(data);
  }


  setLoggedInQueues(data:any){
    this.loggedInQueues.next(data);
  }
}
