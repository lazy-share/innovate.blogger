import {RouterModule, Routes} from "@angular/router";
import {RegisterComponent} from "./register.component";
import {NgModule} from "@angular/core";
import {RegisterSuccessComponent} from "./register-success.component";
import {HintComponent} from "../../shared/hint/hint.component";
/**
 * Created by laizhiyuan on 2017/9/27.
 */
const REGISTER_ROUTES: Routes = [
    {path: "", component: RegisterComponent},
    {path: 'success', component: RegisterSuccessComponent}
  ]
  ;
@NgModule({
  imports: [
    RouterModule.forChild(REGISTER_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class RegisterRoutingModule {

}
