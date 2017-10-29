import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {RelationRoutingModule} from "./relation-routing.module";
import {RelationComponent} from "./relation.component";
import {RelationResolveService} from "./relation-resolve.service";
/**
 * Created by lzy on 2017/10/29.
 */
@NgModule({
  imports: [
    SharedModule,
    RelationRoutingModule
  ],
  declarations: [
    RelationComponent
  ],
  providers: [
    RelationResolveService
  ]
})
export class RelationModule {

}
