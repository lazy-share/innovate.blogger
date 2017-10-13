import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CompareToDirective} from "./form-validate/compare-to.directive";
import {MainNavComponent} from "./main-nav/main-nav.component";
import {FooterComponent} from "./footer/footer.component";
import {CommonModule} from "@angular/common";
import {HintComponent} from "./hint/hint.component";
import {RouterModule} from "@angular/router";
import {SubNavComponent} from "./sub-nav/sub-nav.component";
import {
  IllegalRequestComponent,
  NotFoundComponent,
  NotFoundAccountComponent,
  SystemErrorComponent
} from "./common/common.component";
import {SelectGenderComponent} from "./form-component/select-gender/select-gender.component";
import {SelectEducationComponent} from "./form-component/select-education/select-education.component";
import {PaginationModule, TooltipModule, PopoverModule, ModalModule} from "ngx-bootstrap";
import {SelectAddressComponent} from "./form-component/select-address/select-address.component";
import {EmailDirective} from "./form-validate/email.directive";
import {MobileDirective} from "./form-validate/mobile.directive";
import {FileUploadModule} from "ng2-file-upload";
import {MyDatePickerModule} from "mydatepicker";
import {MyDatePickerPipe} from "./form-pipe/my-date-picker";
import {TinymceEditorComponent} from "./tinymce-editor/tinymce.component";
import {IsExistsArrPipe, JoinArrPipe} from "./common/common.pipe";
import {ReplyComponent} from "./reply/reply.component";
import {EstimateComponent} from "./estimate/estimate.component";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    MyDatePickerModule,
    CommonModule,
    FileUploadModule
  ],
  declarations: [
    CompareToDirective,
    EmailDirective,
    MobileDirective,
    MainNavComponent,
    FooterComponent,
    HintComponent,
    NotFoundComponent,
    NotFoundAccountComponent,
    SystemErrorComponent,
    SubNavComponent,
    IllegalRequestComponent,
    SelectGenderComponent,
    SelectEducationComponent,
    SelectAddressComponent,
    MyDatePickerPipe,
    IsExistsArrPipe,
    TinymceEditorComponent,
    JoinArrPipe,
    ReplyComponent,
    EstimateComponent
  ],
  exports: [
    RouterModule,
    PaginationModule,
    TooltipModule,
    MyDatePickerModule,
    MyDatePickerPipe,
    FormsModule,
    CommonModule,
    CompareToDirective,
    EmailDirective,
    MobileDirective,
    MainNavComponent,
    FooterComponent,
    HintComponent,
    NotFoundComponent,
    NotFoundAccountComponent,
    SubNavComponent,
    IllegalRequestComponent,
    SystemErrorComponent,
    SelectGenderComponent,
    SelectEducationComponent,
    SelectAddressComponent,
    FileUploadModule,
    TinymceEditorComponent,
    IsExistsArrPipe,
    JoinArrPipe,
    PopoverModule,
    ModalModule,
    ReplyComponent,
    EstimateComponent
  ]
})
export class SharedModule {

}
