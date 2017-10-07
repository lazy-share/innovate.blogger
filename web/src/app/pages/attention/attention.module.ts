import {NgModule} from "@angular/core";
import {AttentionService} from "./attention.service";
import {AttentionComponent} from "./attention.component";
import {AttentionRoutingModule} from "./attention-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {AttentionResolveService} from "./attention-resolve.service";
/**
 * Created by lzy on 2017/10/2.
 */
@NgModule({
  providers: [AttentionService, AttentionResolveService],
  declarations: [AttentionComponent],
  imports: [
    SharedModule,
    AttentionRoutingModule
  ]
})
export class AttentionModule {

}
