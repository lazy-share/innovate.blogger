import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home.component";
import {NgModule} from "@angular/core";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
const HOME_ROUTES: Routes = [
  {path: '', component: HomeComponent}
];
@NgModule({
  imports: [
    RouterModule.forChild(HOME_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule {

}
