import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ContactAddDialogueComponent } from '../contact-add-dialogue/contact-add-dialogue.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  submitted: boolean = false;
  contacts: any = [];
  subscribe: Subscription

  constructor(private apiService: ApiService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getContact();
  }

  getContact() {
    this.spinner.show();
    this.subscribe = this.apiService.get('auth/contacts').subscribe(
      (res) => {
        this.contacts = res.contacts;
        this.spinner.hide();
      },

      (err) => {
        this.toastr.error('Failed to fetch contacts!', 'Failed!');
        this.spinner.hide();
      }
    )
  }

  addContact() {
    const dialogRef = this.dialog.open(ContactAddDialogueComponent, {
      height: '630px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        console.log(res);
        if (res == 'add') {
          this.getContact();
        }
      }
    )
  }
}
