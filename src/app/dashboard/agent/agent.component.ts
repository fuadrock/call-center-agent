import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {


  dropdownList:any = [];
  selectedItems :any= [];
  dropdownSettings = {};

  constructor() {
  }


  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Queue 1 - Sales' },
      { item_id: 2, item_text: 'Queue 2 - Support' },
      { item_id: 3, item_text: 'Queue 3 - Billing' },
      { item_id: 4, item_text: 'Queue 4 - General Enquiries' },

    ];
    this.selectedItems = [
      { item_id: 1, item_text: 'Queue 1 - Sales' },
      { item_id: 2, item_text: 'Queue 2 - Support' },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }



}

