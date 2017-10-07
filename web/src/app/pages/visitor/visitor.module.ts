import {NgModule} from "@angular/core";
import {VisitorService} from "./visitor.service";
import {SharedModule} from "../../shared/shared.module";
import {VisitorRoutingModule} from "./visitor-routing.module";
import {VisitorComponent} from "./visitor.component";
import {VisitorResolveService} from "./visitor-resolve.service";
/**
 * Created by lzy on 2017/10/6.
 */
@NgModule({
  imports: [
    SharedModule,
    VisitorRoutingModule
  ],
  providers: [VisitorService, VisitorResolveService],
  declarations: [VisitorComponent]
})
export class VisitorModule {

}
