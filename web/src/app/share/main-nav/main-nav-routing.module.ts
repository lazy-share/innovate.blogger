import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
const MANIN_NAV_ROUTES : Routes = [];
@NgModule({
  imports: [
    RouterModule.forChild(MANIN_NAV_ROUTES)
  ],
  exports: [RouterModule]
})
export class MainNavRoutingModule {

}
