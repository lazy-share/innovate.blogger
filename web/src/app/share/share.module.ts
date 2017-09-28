import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CompareToDirective} from "./form-validate/compare-to.directive";
import {MainNavComponent} from "./main-nav/main-nav.component";
import {FooterComponent} from "./footer/footer.component";
import {CommonModule} from "@angular/common";
import {HintComponent} from "./hint/hint.component";
import {RouterModule} from "@angular/router";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    HttpClientModule,
    RouterModule,
    FormsModule,
    CommonModule,
  ],
  declarations: [
    CompareToDirective,
    MainNavComponent,
    FooterComponent,
    HintComponent
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    FormsModule,
    CommonModule,
    CompareToDirective,
    MainNavComponent,
    FooterComponent,
    HintComponent
  ]
})
export class ShareModule {

}
