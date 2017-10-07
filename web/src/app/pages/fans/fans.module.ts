import {NgModule} from "@angular/core";
import {FansService} from "./fans.service";
import {FansComponent} from "./fans.component";
import {FansRoutingModule} from "./fans-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {FansResolveService} from "./fans-resolve.service";
/**
 * Created by lzy on 2017/10/2.
 */
@NgModule({
  providers: [FansService, FansResolveService],
  declarations: [FansComponent],
  imports: [
    SharedModule,
    FansRoutingModule
  ]
})
export class FansModule {

}
