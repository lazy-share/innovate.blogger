import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {InfoComponent} from "./info.component";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
const INFO_ROUTES: Routes = [
  {path:':username', component: InfoComponent}
];
@NgModule({
  imports: [RouterModule.forChild(INFO_ROUTES)],
  exports: [RouterModule]
})
export class InfoRoutingModule {

}
