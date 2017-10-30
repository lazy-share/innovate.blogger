import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {FansComponent} from "./fans.component";
import {FansResolveService} from "./fans-resolve.service";
/**
 * Created by lzy on 2017/10/2.
 */
const FANS_ROUTERS: Routes = [
  {path: '', redirectTo: '/not-found', pathMatch: 'full'},
  {path: ':account_id', component: FansComponent, resolve: {obj: FansResolveService}}
];
@NgModule({
  imports: [RouterModule.forChild(FANS_ROUTERS)],
  exports: [RouterModule]
})
export class FansRoutingModule {

}
