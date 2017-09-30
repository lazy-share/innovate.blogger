import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CenterComponent} from "./center.component";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
const CENTER_ROUTES: Routes = [
  {path: ':username', component: CenterComponent},
  {path: 'info', loadChildren: 'app/pages/center/info/info.module#InfoModule', outlet: 'center'}
];
@NgModule({
  imports: [RouterModule.forChild(CENTER_ROUTES)],
  exports: [RouterModule]
})
export class CenterRoutingModule {

}
