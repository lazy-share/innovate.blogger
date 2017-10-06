import {NgModule} from "@angular/core";
import {AttentionService} from "./fans.service";
import {FansComponent} from "./fans.component";
import {FansRoutingModule} from "./fans-routing.module";
import {SharedModule} from "../../shared/shared.module";
/**
 * Created by lzy on 2017/10/2.
 */
@NgModule({
  providers: [AttentionService],
  declarations: [FansComponent],
  imports: [
    SharedModule,
    FansRoutingModule
  ]
})
export class FansModule {

}
