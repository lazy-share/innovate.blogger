import {NgModule} from "@angular/core";
import {ForgetComponent} from "./forget.component";
import {RouterModule, Routes} from "@angular/router";
/**
 * Created by laizhiyuan on 2017/9/28.
 */
const FORGET_ROUTERS: Routes = [
  {path: '', component: ForgetComponent}
];
@NgModule({
  imports: [
    RouterModule.forChild(FORGET_ROUTERS)
  ],
  exports: [RouterModule]
})
export class ForgetRoutingModule {

}
