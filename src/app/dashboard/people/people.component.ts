import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit, OnDestroy {
  @ViewChild('peopleSearchInput', { static: true }) peopleSearchInput: ElementRef;
  submitted: boolean = false;
  peoples: any = [];
  subscribe: Subscription;
  random: number = this.getRandomInt();
  total: any = 0;


  constructor(private apiService: ApiService,
    private router: Router,

    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private sanitizer:DomSanitizer) {

    this.getPeoples();
  }


  ngOnInit() {

    console.log(this.peopleSearchInput);

    fromEvent(this.peopleSearchInput.nativeElement, 'keyup').pipe(

      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 1)

      // Time in milliseconds between key events
      , debounceTime(500)

      // If previous query is diffent from current
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {

      this.spinner.show();
      this.subscribe = this.apiService.get('auth/peoples?search=' + text).subscribe(
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

    });
  }

  getPeoples() {

    this.spinner.show();
    this.subscribe = this.apiService.get('auth/peoples').subscribe(
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

    if(number){
      this.router.navigate(['dashboard/contact-details/'+number]);
    }

  }

  getRandomInt() {
    return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  url = this.sanitizer.bypassSecurityTrustResourceUrl('assets/iframe.html');

}
