import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AttentionComponent} from "./attention.component";
/**
 * Created by lzy on 2017/10/2.
 */
const ATTENTION_ROUTERS: Routes = [
  {path: ':username', component: AttentionComponent}
];
@NgModule({
  imports: [RouterModule.forChild(ATTENTION_ROUTERS)],
  exports: [RouterModule]
})
export class AttentionRoutingModule {

}
