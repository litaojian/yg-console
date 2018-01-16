import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgModule, ModuleWithProviders }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MySelect2Component }  from '../v2/myselect2.component';
import { CounterComponent }  from '../v2/mytime.component';
import { MyLoadingComponent }  from '../v2/myloading.component';
import { MyDatePickerComponent }  from '../v2/mydatepicker.component';
import { ModalComponent }  from '../v2/mymodal.component';
import { PanelComponent }  from '../v2/mypanel.component';
import { TabelComponent }  from '../v2/mytabel.component';
import { HeaderSearchComponent }  from '../v2/searchInput.component';
import { NzSelectComponent }  from '../v2/my-select2.component';
import { selectService } from './my-select2.service';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgZorroAntdModule,
        ReactiveFormsModule
    ],
    exports:[
        MySelect2Component,
        MyDatePickerComponent,
        CounterComponent,
        MyLoadingComponent,
        ModalComponent,
        PanelComponent,
        TabelComponent,
        HeaderSearchComponent,
        NzSelectComponent
    ],
    declarations: [
        MySelect2Component,
        MyDatePickerComponent,
        CounterComponent,
        MyLoadingComponent,
        ModalComponent,
        PanelComponent,
        TabelComponent,
        HeaderSearchComponent,
        NzSelectComponent
    ],
    // entryComponents: [
    //     NzModalCustomizeComponent
    // ],
    providers: [selectService],
}) 

export class AppBaseModule {
    constructor() {

    }
}