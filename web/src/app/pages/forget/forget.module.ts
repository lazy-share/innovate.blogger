import {NgModule} from "@angular/core";
import {ForgetService} from "./forget.service";
import {SharedModule} from "../../shared/shared.module";
import {ForgetComponent} from "./forget.component";
import {ForgetRoutingModule} from "./forget-routing.module";
import {ForgetSuccessComponent} from "./forget-success.component";
/**
 * Created by laizhiyuan on 2017/9/28.
 */
@NgModule({
  providers: [ForgetService],
  imports: [
    SharedModule,
    ForgetRoutingModule
  ],
  declarations: [ForgetComponent,ForgetSuccessComponent]
})
export class ForgetModule {

}
