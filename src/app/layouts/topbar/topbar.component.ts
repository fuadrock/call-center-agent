import { Component, OnInit, EventEmitter, Output, ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as $ from 'jquery'
declare const ResizeFrame: any;
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})


export class TopbarComponent implements OnInit {
  height= 50;

  mode: string | undefined;
  flagvalue: any;
  cookieValue: any;
  countryName: any;
  valueset: any;
  user: any = { name: "Admin", email: "admin@asiatel.com" };
  @ViewChild('StatusBtn', { static: true }) input: ElementRef;
  @ViewChild('frame', { static: true }) frame: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  iframeSrc: SafeUrl | undefined;
  password: string | null;
  statuses: any;

  currentStatus: any = {
    "id": 1,
    "name": "Available",
    "description": "Available",
    "color": "#51d28c",
    "status": true,
    "created_at": "2022-09-22T12:39:17.000000Z",
    "updated_at": "2022-09-22T12:39:17.000000Z",
    "a_class": "st-available",
    "i_class": "text-success"
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private com: CommunicationService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
   ) {

    this.user = JSON.parse(localStorage.getItem("profile") || '{}');

    this.password = localStorage.getItem('password');

    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://365smartconnect.asiamediatel.com/dialer/js_sip-dialpad.html?uri=sip:` + this.user.agent.extension + `@20.212.144.167&uname=` + this.user.agent.extension + `@20.212.144.167&password=` + this.password + `&stun=stun:stun.l.google.com:19302`);

    if (window.addEventListener) {
      window.addEventListener("message", this.receiveMessage.bind(this), false);
    } else {
       (<any>window).attachEvent("onmessage", this.receiveMessage.bind(this));
    }
  }



  @Output() settingsButtonClicked = new EventEmitter();

  ngOnInit(): void {

    this.com.getProfile.subscribe(
      res => {
        if (res) {
          this.user = res;
        }
      }
    );

    this.apiService.get("auth/statuses").subscribe(
      res => {
        this.statuses = res.statuses;
      },
      err => { }
    );
    this.getCurrentStatus();

  }

  getCurrentStatus() {
    this.apiService.get("auth/get_status").subscribe(
      res => {
        if (res.status?.status) {
          this.currentStatus = res.status.status;
          this.input.nativeElement.classList.add(this.currentStatus.i_class);
        }
      }
    )
  }

  setStatus(status: any, StatusBtn: HTMLElement) {
    let data = status;
    this.spinner.show();
    this.apiService.post("auth/set_status", { "status_id": data.id }).subscribe(
      res => {
        this.spinner.hide();
        console.log(StatusBtn);
        this.input.nativeElement.classList.remove(this.currentStatus.i_class);
        this.currentStatus = res.status.status;
        this.input.nativeElement.classList.add(this.currentStatus.i_class);
        console.log(StatusBtn);
        this.toastr.success("Status update successful.", "Success");
      },
      err => {
        this.spinner.hide();
        this.toastr.error("Status update failed!", "Failed");
      }
    )
  }

  setStatusColor(StatusBtn: HTMLElement) {

  }



  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }



  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  logout() {
    this.spinner.show();
    this.apiService.get("auth/logout").subscribe(
      res => {
        this.spinner.hide();
        localStorage.clear();
        this.toastr.success("Logout successful.", "Success");
        this.router.navigate(['/auth/login']);
      },
      err => {
        this.spinner.hide();
        this.router.navigate(['/auth/login']);
        this.toastr.error("Logout failed!", "Failed");
      }
    )

  }


  ResizeFrame(){
    console.log("called function");
    if(this.height==50){
      this.renderer.setStyle(this.frame.nativeElement, "height", '500px');
      this.height = 500;
    }
    else{
      this.renderer.setStyle(this.frame.nativeElement, "height", '50px');
      this.height = 50;
    }
  }

  receiveMessage = (event: any) => {
     console.log("parent called");
  //   console.log(event)
  //   const height = event.data.height+'px';
  //  this.renderer.setStyle(this.frame.nativeElement, "height", height);
  //   $('.iframe-init').css("height", height);


  if(this.height==50){
    this.renderer.setStyle(this.frame.nativeElement, "height", '500px');
    this.height = 500;
  }
  else{
    this.renderer.setStyle(this.frame.nativeElement, "height", '50px');
    this.height = 50;
  }
  }





}
