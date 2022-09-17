import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {


  public profile = new BehaviorSubject<any>('');
  getProfile = this.profile.asObservable();

  constructor() { }

  setProfile(data:any){
    this.profile.next(data);
  }
}
