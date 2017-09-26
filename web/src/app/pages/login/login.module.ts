import {NgModule} from "@angular/core/src/metadata/ng_module";
import {LoginComponent} from "./login.component";
import {LoginRoutingModule} from "./login-routing.module";
/**
 * Created by lzy on 2017/9/26.
 */
@NgModule({
  imports: [
    LoginRoutingModule
  ],
  declarations: [
    LoginComponent
  ],
  exports: [LoginComponent]
})
export class LoginModule {

}
