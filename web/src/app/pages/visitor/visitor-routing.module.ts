import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {VisitorComponent} from "./visitor.component";
import {VisitorResolveService} from "./visitor-resolve.service";
/**
 * Created by lzy on 2017/10/6.
 */
const VISITOR_ROUTERS: Routes = [
  {path: '', redirectTo: '/not-found', pathMatch: 'full'},
  {path: ':username', component: VisitorComponent, resolve: {obj: VisitorResolveService}}
];
@NgModule({
  imports: [RouterModule.forChild(VISITOR_ROUTERS)],
  exports: [RouterModule]
})
export class VisitorRoutingModule {

}
