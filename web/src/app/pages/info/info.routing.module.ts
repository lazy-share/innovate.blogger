import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {InfoComponent} from "./info.component";
import {InfoResolverService} from "./info-resolver.service";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
const INFO_ROUTES: Routes = [
  {path:':username', component: InfoComponent, resolve: {accountInfo: InfoResolverService}}
];
@NgModule({
  imports: [RouterModule.forChild(INFO_ROUTES)],
  exports: [RouterModule],
  providers: [InfoResolverService]
})
export class InfoRoutingModule {

}
