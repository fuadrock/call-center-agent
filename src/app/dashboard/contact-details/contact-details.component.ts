import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from '../delete-dialogue/delete-dialogue.component';
@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export class ContactDetailsComponent implements OnInit {

  public userId: string;
  subscribe: any;
  details: any;
  contactForm: any;
  taBIndex = 0;
  peoples: any = [];
  departments: any = [];
  ticketForm: any;
  recentTickets: any = [];
  ticketResponse: any;
  responseForm: any;
  editTicketForm: any;

  constructor(route: ActivatedRoute, private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public dialog: MatDialog,) {

    config.backdrop = 'static';
		config.keyboard = false;

    this.contactForm = this.fb.group({
      email: ['', [Validators.required]],
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      work_phone: ['', [Validators.required]],
      organization: ['', [Validators.required]],
      role: ["", [Validators.required]],
      type: ["", [Validators.required]],
      address: ["", [Validators.required]],
      city: ["", [Validators.required]],
      country: ["", [Validators.required]],
      zip: ["", [Validators.required]],
    });

    this.ticketForm = this.fb.group({
      contact_id: ['', [Validators.required]],
      department_id: ["", [Validators.required]],
      agent_id: ["", [Validators.required]],
      subject: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: ["", [Validators.required]],
      ticket_status: ["", [Validators.required]],

    });


    this.editTicketForm = this.fb.group({
      id: ['', [Validators.required]],
      contact_id: ['', [Validators.required]],
      department_id: ["", [Validators.required]],
      agent_id: ["", [Validators.required]],
      subject: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: ["", [Validators.required]],
      ticket_status: ["", [Validators.required]],

    });


    this.responseForm = this.fb.group({
      ticket_id: [''],
      notes: ["", [Validators.required]],
    })

    route.params.subscribe((params) => {
      this.userId = params["id"];
    });

  }

  ngOnInit(): void {
    this.getDetails();
    this.getDepartment();
    this.getAgent();
  }

  edit(content:any,ticket:any) {
		this.modalService.open(content,{ size: 'lg', backdrop: 'static' });
    console.log(ticket);

    this.editTicketForm.patchValue({
      id: ticket.id,
      contact_id: ticket.contact_id,
      department_id: ticket.department_id,
      agent_id: ticket.agent_id,
      subject: ticket.subject,
      description: ticket.description,
      priority: ticket.priority,
      ticket_status:ticket.ticket_status,
    })


	}

  onSubmitResponse() {
    if(this.responseForm.valid){
      let formData = this.responseForm.value;
      formData.ticket_id = this.ticketResponse.id;
      this.spinner.show();
      this.apiService.post('auth/ticket_responses',formData).subscribe(
        res => {
          let data = res.ticket_response;
          data.user = JSON.parse(localStorage.getItem('profile') || '{}');
          this.spinner.hide();
          this.toastr.success('Adding response successful!', 'Success!');
          this.responseForm.reset();
         this.ticketResponse.responses.push(data);
        },
        err => {
          this.spinner.hide();
          this.toastr.error('Failed to add response!', 'Failed!');
        }
      )
    }

  }

  onSubmitTicket(status:string) {
    let formdata;
    if(status=='new'){
      formdata = this.ticketForm;
    }
    else{
      formdata = this.editTicketForm;
    }


    this.spinner.show();
    if (formdata.valid) {
      this.apiService.post('auth/tickets', formdata.value).subscribe(
        res => {
          this.spinner.hide();
          if(status=='new'){
          this.toastr.success('Adding ticket successful!', 'Success!');
          this.recentTickets.push(res.ticket);
          this.ticketResponse = res.ticket;
          this.taBIndex = 2;
          }
          else{
            this.toastr.success('Update ticket successful!', 'Success!');
            this.getDetails();
          }

        },
        err => {
          this.spinner.hide();
          this.toastr.error('Failed to add ticket!', 'Failed!');
        }
      )
    }
    else{
      alert("Please fill all of the fields!")
    }
  }

  showResponse(ticket: any) {
    console.log(ticket);
    this.ticketResponse = ticket;
    this.taBIndex = 2;

  }

  getDetails() {

    this.spinner.show();
    this.subscribe = this.apiService.get('auth/get_contact_crm/' + this.userId).subscribe(
      (res) => {
        this.details = res;
        this.spinner.hide();

        this.recentTickets = this.details.contact.tickets;

        this.contactForm.setValue({
          type: this.details.contact.type,
          first_name: this.details.contact.first_name,
          last_name: this.details.contact.last_name,
          organization: this.details.contact.organization,
          role: this.details.contact.role,
          email: this.details.contact.email,

          work_phone: this.details.contact.work_phone,
          address: this.details.contact.address,
          city: this.details.contact.city,
          country: this.details.contact.country,
          zip: this.details.contact.zip,
        });

        this.ticketForm.controls['contact_id'].patchValue(this.details.contact.id);
      },

      (err) => {
        this.toastr.error('Failed to fetch details!', 'Failed!');

        this.contactForm.controls['work_phone'].patchValue(this.userId);
        this.spinner.hide();
      }
    )
  }

  onSubmit() {
    console.log(this.contactForm);
    if (this.contactForm.valid) {
      this.spinner.show();
      let formdata = this.contactForm.value;
      if (this.details?.contact?.id) {
        formdata.id = this.details.contact.id;
      }
      this.apiService.post('auth/contacts', formdata).subscribe(
        res => {
          this.spinner.hide();
          this.toastr.success('Adding contact successful!', 'Success!');
          if (this.details?.contact?.id) {
          this.getDetails();
          }

        },
        err => {
          this.spinner.hide();
          this.toastr.error('Failed to add contacts!', 'Failed!');
        }
      )
    }
    else{

        alert("Please fill all of the fields!")

    }

  }

  getAgent() {
    this.subscribe = this.apiService.get('auth/peoples').subscribe(
      (res) => {
        this.peoples = [];
        this.peoples = res.peoples;

      },

      (err) => {
        this.toastr.error('Failed to fetch agent!', 'Failed!');

      }
    )
  }

  getDepartment() {
    this.subscribe = this.apiService.get('auth/departments').subscribe(
      (res) => {
        this.departments = [];
        this.departments = res.departments;

      },

      (err) => {
        this.toastr.error('Failed to fetch department!', 'Failed!');

      }
    )
  }


  delete(ticket: any) {
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {

      data: { type: 'ticket', value: ticket.subject },
    });


    dialogRef.afterClosed().subscribe(
      (res) => {
        console.log(res);
        if (res == 'confirm') {
          this.spinner.show();
          this.subscribe = this.apiService.delete('auth/tickets/' + ticket.id).subscribe(
            (res) => {
              this.getDetails();
              this.toastr.success('Success deleting ticket!', 'Success!');
            },

            (err) => {
              this.toastr.error('Failed to delete ticket!', 'Failed!');
              this.spinner.hide();
            }
          ) }
      }
    )
  }
}
