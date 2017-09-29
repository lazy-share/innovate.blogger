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
import {CenterComponent} from "./center/center.component";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    HttpClientModule,
    RouterModule,
    FormsModule,
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
    CenterComponent
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    FormsModule,
    CommonModule,
    CompareToDirective,
    MainNavComponent,
    FooterComponent,
    HintComponent,
    NotFoundComponent,
    SubNavComponent,
    IllegalRequestComponent,
    CenterComponent
  ]
})
export class ShareModule {

}
