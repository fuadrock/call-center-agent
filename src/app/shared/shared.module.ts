import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { WidgetModule } from './widget/widget.module';

@NgModule({
  declarations: [
    PagetitleComponent
  ],
  imports: [
    CommonModule,
    WidgetModule
  ],
  exports: [PagetitleComponent]
})
export class SharedModule { }
