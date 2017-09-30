import {NgModule} from "@angular/core";
import {InfoRoutingModule} from "./info.routing.module";
import {InfoComponent} from "./info.component";
import {SharedModule} from "../../../shared/shared.module";
import {InfoService} from "./info.service";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@NgModule({
  imports: [
    InfoRoutingModule,
    SharedModule
  ],
  providers: [InfoService],
  declarations: [InfoComponent]
})
export class InfoModule {

}
