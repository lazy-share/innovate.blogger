import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {RelationResolveService} from "./relation-resolve.service";
import {RelationComponent} from "./relation.component";
const RELATION_ROUTERS: Routes = [
  {path: '', redirectTo: '/not-found', pathMatch: 'full'},
  {path: ':account_id', component: RelationComponent, resolve: {data: RelationResolveService}}
];
@NgModule({
  imports: [RouterModule.forChild(RELATION_ROUTERS)],
  exports: [RouterModule]
})
export class RelationRoutingModule {

}
