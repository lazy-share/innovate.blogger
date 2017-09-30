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
import {IllegalRequestComponent, NotFoundComponent} from "./common/common.component";
import {SelectGenderComponent} from "./form/select-gender/select-gender.component";
import {SelectEducationComponent} from "./form/select-education/select-education.component";
import {BsDatepickerModule} from "ngx-bootstrap";
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { de } from 'ngx-bootstrap/locale';
defineLocale('de', de);
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    HttpClientModule,
    RouterModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    CommonModule
  ],
  declarations: [
    CompareToDirective,
    MainNavComponent,
    FooterComponent,
    HintComponent,
    NotFoundComponent,
    SubNavComponent,
    IllegalRequestComponent,
    SelectGenderComponent,
    SelectEducationComponent
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    BsDatepickerModule,
    FormsModule,
    CommonModule,
    CompareToDirective,
    MainNavComponent,
    FooterComponent,
    HintComponent,
    NotFoundComponent,
    SubNavComponent,
    IllegalRequestComponent,
    SelectGenderComponent,
    SelectEducationComponent
  ]
})
export class SharedModule {

}
