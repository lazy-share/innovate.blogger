import {NgModule} from "@angular/core";
import {InfoRoutingModule} from "./info.routing.module";
import {InfoComponent} from "./info.component";
import {ShareModule} from "../../share/share.module";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@NgModule({
  imports: [
    InfoRoutingModule,
    ShareModule
  ],
  declarations: [InfoComponent]
})
export class InfoModule {

}
