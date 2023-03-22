import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

import { DomSanitizer } from '@angular/platform-browser';
import { CommunicationService } from 'src/app/core/services/communication.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit, OnDestroy {
 // @ViewChild('peopleSearchInput') peopleSearch: ElementRef;
  @ViewChild('peopleSearchInput') peopleSearch:ElementRef;
  submitted: boolean = false;
  peoples: any = [];
  subscribe: Subscription;
  random: number = this.getRandomInt();
  total: any = 0;


  constructor(private apiService: ApiService,
    private router: Router,
    private dataCom: CommunicationService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private sanitizer:DomSanitizer) {

    this.getPeoples();
  }


  ngOnInit() {

   // console.log(this.peopleSearch.nativeElement.value);

    // fromEvent(this.peopleSearchInput.nativeElement, 'keyup').pipe(
    //   map((event: any) => {
    //     return event.target.value;
    //   }),
    //   filter(res => res.length > 1),
    //   debounceTime(500),
    //   distinctUntilChanged()).
    //   subscribe((text: string) => {

    //   this.spinner.show();
    //   this.subscribe = this.apiService.get('auth/peoples?search=' + text).subscribe(
    //     (res) => {
    //       this.peoples = [];
    //       this.peoples = res.peoples;
    //       this.total = res.peoples.length;
    //       this.spinner.hide();
    //     },

    //     (err) => {
    //       this.toastr.error('Failed to fetch peoples!', 'Failed!');
    //       this.spinner.hide();
    //     }
    //   )

    // });
  }

  getPeoples() {
    let search = ''
    if(this.peopleSearch){
     search = this.peopleSearch.nativeElement.value;
    }

    this.spinner.show();
    this.subscribe = this.apiService.get('auth/peoples?search='+search).subscribe(
      (res) => {
        this.peoples = [];
        this.peoples = res.peoples;
        this.total = res.peoples.length;
        this.spinner.hide();
      },

      (err) => {
        this.toastr.error('Failed to fetch peoples!', 'Failed!');
        this.spinner.hide();
      }
    )
  }

  gotoDetails(number:any){

    this.dataCom.openCall(number);

    if(number){
     // this.router.navigate(['dashboard/contact-details/'+number]);
    }

  }

  getRandomInt() {
    return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  }

  ngOnDestroy(): void {
    if(this.subscribe){
    this.subscribe.unsubscribe();
    }
  }



}
