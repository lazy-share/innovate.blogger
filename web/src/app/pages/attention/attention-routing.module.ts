import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AttentionComponent} from "./attention.component";
import {AttentionResolveService} from "./attention-resolve.service";
/**
 * Created by lzy on 2017/10/2.
 */
const ATTENTION_ROUTERS: Routes = [
  {path: '', redirectTo: '/not-found', pathMatch: 'full'},
  {path: ':account_id', component: AttentionComponent, resolve: {obj: AttentionResolveService}}
];
@NgModule({
  imports: [RouterModule.forChild(ATTENTION_ROUTERS)],
  exports: [RouterModule]
})
export class AttentionRoutingModule {

}
