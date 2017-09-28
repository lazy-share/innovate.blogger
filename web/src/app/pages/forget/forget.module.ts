import {NgModule} from "@angular/core";
import {ForgetService} from "./forget.service";
import {ShareModule} from "../../share/share.module";
import {ForgetComponent} from "./forget.component";
import {ForgetRoutingModule} from "./forget-routing.module";
/**
 * Created by laizhiyuan on 2017/9/28.
 */
@NgModule({
  providers: [ForgetService],
  imports: [
    ShareModule,
    ForgetRoutingModule
  ],
  declarations: [ForgetComponent]
})
export class ForgetModule {

}
