import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {FansComponent} from "./fans.component";
/**
 * Created by lzy on 2017/10/2.
 */
const FANS_ROUTERS: Routes = [
  {path: ':username', component: FansComponent}
];
@NgModule({
  imports: [RouterModule.forChild(FANS_ROUTERS)],
  exports: [RouterModule]
})
export class FansRoutingModule {

}
