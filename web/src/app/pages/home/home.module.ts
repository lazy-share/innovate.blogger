import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {HomeComponent} from "./home.component";
import {HomeRoutingModule} from "./home-routing.module";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule {

}
