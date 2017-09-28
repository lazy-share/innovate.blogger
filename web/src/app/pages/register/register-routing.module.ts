import {RouterModule, Routes} from "@angular/router";
import {RegisterComponent} from "./register.component";
import {NgModule} from "@angular/core";
import {RegisterSuccessComponent} from "./register-success.component";
/**
 * Created by laizhiyuan on 2017/9/27.
 */
const REGISTER_ROUTES: Routes = [
  {
    path:"", component: RegisterComponent,
    children: [
      {path: 'success', component: RegisterSuccessComponent}
    ]
  }
];
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
