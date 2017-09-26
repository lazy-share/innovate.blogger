import {NgModule} from "@angular/core";
import {ShareModule} from "../../share/share.module";
import {HomeComponent} from "./home.component";
import {HomeRoutingModule} from "./home-routing.module";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    ShareModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule {

}
