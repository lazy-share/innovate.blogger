import {NgModule} from "@angular/core";
import {MainNavModule} from "./main-nav/main-nav.module";
import {MainNavComponent} from "./main-nav/main-nav.component";
import {FooterModule} from "./footer/footer.module";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    MainNavModule,
    FooterModule
  ],
  providers: [],
  exports: [
    MainNavModule,
    FooterModule
  ]
})
export class ShareModule {

}
