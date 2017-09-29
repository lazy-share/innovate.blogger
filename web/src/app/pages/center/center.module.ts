import {NgModule} from "@angular/core";
import {CenterRoutingModule} from "./center-routing.module";
import {CenterComponent} from "./center.component";
import {SharedModule} from "../../shared/shared.module";
import {InfoComponent} from "../info/info.component";
/**
 * Created by lzy on 2017/9/29.
 */
@NgModule({
  imports: [
    SharedModule,
    CenterRoutingModule
  ],
  declarations: [
    CenterComponent,
    InfoComponent
  ]
})
export class CenterModule {

}
