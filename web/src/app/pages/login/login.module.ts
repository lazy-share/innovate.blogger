import {LoginComponent} from "./login.component";
import {LoginRoutingModule} from "./login-routing.module";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
/**
 * Created by lzy on 2017/9/26.
 */
@NgModule({
  imports: [
    LoginRoutingModule,
    FormsModule
  ],
  declarations: [
    LoginComponent
  ],
  exports: [LoginComponent]
})
export class LoginModule {

}

