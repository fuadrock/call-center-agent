import { Component, OnInit, EventEmitter, Output, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar Component
 */
export class TopbarComponent implements OnInit {

  mode: string | undefined;
  flagvalue: any;
  cookieValue: any;
  countryName: any;
  valueset: any;
  user: any = { name: "Admin", email: "admin@asiatel.com" };
  @ViewChild('StatusBtn', { static: true }) input: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  iframeSrc: SafeUrl | undefined;
  password: string | null;
  statuses: any;
  currentStatus: any={
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
    private element: ElementRef,
    private renderer: Renderer2,) {

    this.user = JSON.parse(localStorage.getItem("profile") || '{}');
    console.log("profile3",this.user);
    this.password = localStorage.getItem('password');

    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://365smartconnect.asiamediatel.com/dialer/js_sip-dialpad.html?uri=sip:` + this.user.agent.extension + `@20.212.144.167&uname=` + this.user.agent.extension + `@20.212.144.167&password=` + this.password + `&stun=stun:stun.l.google.com:19302`);

  }

  /***
   * Language Listing
   */


  @Output() settingsButtonClicked = new EventEmitter();

  ngOnInit(): void {

    this.com.getProfile.subscribe(
      res=>{
        if(res){
        this.user=res;
        }
      }
    );

    this.apiService.get("auth/statuses").subscribe(
      res => {
        this.statuses = res.statuses;
      },
      err=>{}
    );
    this.getCurrentStatus();

  }

  getCurrentStatus(){
    this.apiService.get("auth/get_status").subscribe(
      res => {
        if(res.status?.status){
          this.currentStatus = res.status.status;
          this.input.nativeElement.classList.add(this.currentStatus.i_class);
        }
      }
      )
  }

  setStatus(status:any,StatusBtn:HTMLElement){
    let data = status;
    this.spinner.show();
    this.apiService.post("auth/set_status",{"status_id":data.id}).subscribe(
      res => {
        this.spinner.hide();
        console.log(StatusBtn);
        this.input.nativeElement.classList.remove(this.currentStatus.i_class);
        this.currentStatus=res.status.status;
        this.input.nativeElement.classList.add(this.currentStatus.i_class);
        console.log(StatusBtn);
        this.toastr.success("Status update successful.", "Success");
      },
      err=>{
        this.spinner.hide();
        this.toastr.error("Status update failed!", "Failed");
      }
    )
  }

  setStatusColor(StatusBtn:HTMLElement){

  }


  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
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

}
