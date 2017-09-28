import {NgModule} from "@angular/core";
import {RegisterComponent} from "./register.component";
import {RegisterRoutingModule} from "./register-routing.module";
import {ShareModule} from "../../share/share.module";
import {RegisterSuccessComponent} from "./register-success.component";
import {RegisterService} from "./register.service";
/**
 * Created by laizhiyuan on 2017/9/27.
 */
@NgModule({
  declarations: [
    RegisterComponent,
    RegisterSuccessComponent
  ],
  imports: [
    ShareModule,
    RegisterRoutingModule
  ],
  providers: [
    RegisterService
  ],
  exports: [

  ]
})
export class RegisterModule {

}
