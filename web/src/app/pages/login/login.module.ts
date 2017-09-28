import {LoginComponent} from "./login.component";
import {LoginRoutingModule} from "./login-routing.module";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LoginService} from "./login.service";
import {ShareModule} from "../../share/share.module";
/**
 * Created by lzy on 2017/9/26.
 */
@NgModule({
  imports: [
    LoginRoutingModule,
    ShareModule
  ],
  declarations: [
    LoginComponent
  ],
  exports: [LoginComponent],
  providers: [
    LoginService
  ]
})
export class LoginModule {

}

