import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CompareToDirective} from "./form-validate/compare-to.directive";
import {MainNavComponent} from "./main-nav/main-nav.component";
import {FooterComponent} from "./footer/footer.component";
import {CommonModule} from "@angular/common";
import {HintComponent} from "./hint/hint.component";
import {RouterModule} from "@angular/router";
import {SubNavComponent} from "./sub-nav/sub-nav.component";
import {IllegalRequestComponent, NotFoundComponent, NotFoundAccountComponent} from "./common/common.component";
import {SelectGenderComponent} from "./form/select-gender/select-gender.component";
import {SelectEducationComponent} from "./form/select-education/select-education.component";
import {BsDatepickerModule} from "ngx-bootstrap";
import {SelectAddressComponent} from "./form/select-address/select-address.component";
import {EmailDirective} from "./form-validate/email.directive";
import {MobileDirective} from "./form-validate/mobile.directive";
import {FileUploadModule} from "ng2-file-upload";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
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
    SubNavComponent,
    IllegalRequestComponent,
    SelectGenderComponent,
    SelectEducationComponent,
    SelectAddressComponent
  ],
  exports: [
    RouterModule,
    BsDatepickerModule,
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
    SelectGenderComponent,
    SelectEducationComponent,
    SelectAddressComponent,
    FileUploadModule
  ]
})
export class SharedModule {

}
