import {NgModule} from "@angular/core";
import {RegisterComponent} from "./register.component";
import {RegisterRoutingModule} from "./register-routing.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ShareModule} from "../../share/share.module";
/**
 * Created by laizhiyuan on 2017/9/27.
 */
@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    RegisterRoutingModule,
    FormsModule
  ],
  exports: [

  ]
})
export class RegisterModule {

}
