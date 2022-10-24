
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

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
  queueText='';



  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginateStartNo = 0;

  page = 1;
  size = 10;
  pageLength = 0;
  pageSizeOptions = [5, 10];
  pageSort: any;
  subscribe: Subscription;
  total = 0;
  calls: any=[];


  constructor(private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private com: CommunicationService) {

    this.profile = JSON.parse(localStorage.getItem('profile') || '{}');
    this.password = localStorage.getItem('password');
    this.dropdownList = JSON.parse(localStorage.getItem('queues') || '{}');
    this.selectedItems = JSON.parse(localStorage.getItem('loggedInQueue') || '[]');
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://365smartconnect.asiamediatel.com/dialer/js_sip-dialpad.html?uri=sip:` + this.profile.agent.extension + `@20.212.144.167&uname=` + this.profile.agent.extension + `@20.212.144.167&password=` + this.password + `&stun=stun:stun.l.google.com:19302&location=middle`);



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

    this.queueText = this.getExtension();
    this.getCalls({index:0});
  }

  getCalls(type:any) {
    console.log(type)
    let pagination = `?pageNumber=1&pageSize=5`;
    if(type.index==1){
      pagination +=`&type=Missed`
    }
    if(type.index==2){
      pagination +=`&type=Answered`
    }
    if(type.index==3){
      pagination +=`&type=Voice Mail`
    }
    this.spinner.show();
    this.subscribe = this.apiService.get('auth/calls' + pagination).subscribe(
      (res) => {
        this.calls = res.calls
        this.spinner.hide();
      },

      (err) => {
        this.toastr.error('Failed to fetch contacts!', 'Failed!');
        this.spinner.hide();
      }
    )
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
          this.toastr.success("Success", "Logout from all the queues.");
          this.selectedItems = [];
          this.queueText = '';
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

  getExtension() {
    let queues: any = [];
    let text = '';
    this.selectedItems.forEach((e: { name: any; alias: any }) => {
      let data = this.dropdownList.find((el: any) => el.name == e.name);
      let queue = { name: e.name, alias: e.alias, extension: data.extension };
      queues.push(queue);

    });
    if (queues.length > 0) {
      //text+= "<li> <i class='uil uil-users-alt font-size-16 text-warning me-2'></i><b>"+ queues[0].extension +"</b>" + queues[0].alias +"</li>"
      queues.forEach((e: any, index: any) => {
        text+= "<li> <i class='uil uil-users-alt font-size-16 text-warning me-2'></i><b>"+ queues[index].extension +"</b>" + queues[index].alias +"</li>"
          //text += " & <b>" + queues[index].extension + "</b> " + queues[index].alias;

      })
    }

    return text;
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
          this.queueText = this.getExtension();
          this.toastr.success('Login Success!', 'Success!');
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

