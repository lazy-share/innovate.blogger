import {NgModule} from "@angular/core/src/metadata/ng_module";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login.component";
/**
 * Created by lzy on 2017/9/26.
 */
const LOGIN_ROUTES: Routes = [
  {path: 'login', component: LoginComponent}
];
@NgModule({
  imports: [
    RouterModule.forChild(LOGIN_ROUTES)
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule {

}
