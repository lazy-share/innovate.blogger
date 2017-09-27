import {NgModule} from "@angular/core";
import {MainNavModule} from "./main-nav/main-nav.module";
import {FooterModule} from "./footer/footer.module";
import {FormValidateModule} from "./form-validate/form-validate.module";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    MainNavModule,
    FooterModule,
    FormValidateModule
  ],
  providers: [],
  exports: [
    MainNavModule,
    FooterModule,
    FormValidateModule
  ]
})
export class ShareModule {

}
