
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { delay, timeout } from 'rxjs/operators';
import { CommunicationService } from 'src/app/core/services/communication.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {
  iframeSrc: SafeUrl | undefined;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  submitted: boolean = false;
  contacts: any;
  profile: any;
  password: any;


  constructor(private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private com:CommunicationService) {


    this.password = localStorage.getItem('password');
    this.dropdownList = JSON.parse(localStorage.getItem('queues') || '{}');
    this.selectedItems = JSON.parse(localStorage.getItem('loggedInQueue') || '{}');

  //  this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://172.17.1.40/callcenter/dialer/js_sip-dialpad.html?uri=sip:` + this.profile.agent.extension + `@20.212.144.167&uname=` + this.profile.agent.extension+ `@20.212.144.167&password=` + this.password + `&stun=stun:stun.l.google.com:19302`);
  this.com.getProfile.subscribe(
    res=>{
      this.profile=res;
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://172.17.1.40/callcenter/dialer/js_sip-dialpad.html?uri=sip:` + this.profile.agent.extension + `@20.212.144.167&uname=` + this.profile.agent.extension+ `@20.212.144.167&password=` + this.password + `&stun=stun:stun.l.google.com:19302`);

    }
  )

  }


  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'alias',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };

    this.apiService.get('auth/contacts').subscribe(
      res => {
        this.contacts = res.contacts;
      },
      err => {
        this.toastr.error('Failed to fetch contacts!', 'Failed!');

      }
    );

    // this.com.getProfile.subscribe(
    //   res=>{
    //     this.profile=res;
    //     this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://172.17.1.40/callcenter/dialer/js_sip-dialpad.html?uri=sip:` + this.profile.agent.extension + `@20.212.144.167&uname=` + this.profile.agent.extension+ `@20.212.144.167&password=` + this.password + `&stun=stun:stun.l.google.com:19302`);

    //   }
    // )
  }


  transform() {

    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://172.17.1.40/callcenter/dialer/js_sip-dialpad.html?uri=sip:` + this.profile.agent.extension + `@20.212.144.167&uname=` + this.profile.agent.extension+ `@20.212.144.167&password=` + this.password + `&stun=stun:stun.l.google.com:19302`);
    console.log(this.iframeSrc);
    return this.iframeSrc;
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  queueLogout() {

    let loggedInqueue = JSON.parse(localStorage.getItem('loggedInQueue') || '{}');
    if (loggedInqueue.length > 0) {

      this.spinner.show();
      let queues: any = { queues: [] }
      this.selectedItems.forEach((e: { name: any; alias: any }) => {
        let queue = { queue_uuid: e.name, level: "0", position: "0" };
        queues.queues.push(queue);

      });

      this.apiService.post('auth/queue_logout', queues).subscribe(
        res => {
          this.toastr.success("Success", "Logout from queue successful!");
          this.selectedItems = [];
          this.spinner.hide();
        },
        err => {
          this.toastr.error('Logout failed!', 'Failed!');
          this.spinner.hide();
        }
      )

    }
    return false;
  }

  queueLogin() {
    this.submitted = true;
    if (this.selectedItems.length > 0) {
      this.spinner.show();
      let queues: any = { queues: [] }
      this.selectedItems.forEach((e: { name: any; alias: any }) => {
        let queue = { queue_uuid: e.name, level: "0", position: "0" };
        queues.queues.push(queue);

      });

      this.apiService.post('auth/queue_login', queues).subscribe(
        res => {
          localStorage.setItem('queue-login', "1");
          localStorage.setItem("loggedInQueue", JSON.stringify(this.selectedItems));

          this.toastr.success('Login Success!', 'Success!');
          this.router.navigate(['/dashboard/home']);
          this.spinner.hide();
        },
        err => {
          this.toastr.error('Login failed!', 'Failed!');
          this.spinner.hide();
        }
      )

    }

  }


}

