import {NgModule} from "@angular/core";
import {ShareModule} from "../../share/share.module";
import {HomeComponent} from "./home.component";
import {HomeRoutes} from "./home.routes";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    ShareModule,
    HomeRoutes
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule {

}
