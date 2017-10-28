import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {ImageRoutingModule} from "./image-routing.module";
import {ImageResolveService} from "./image-resolve.service";
import {ImageService} from "./image.service";
import {ImageComponent} from "./image.component";
/**
 * Created by lzy on 2017/10/28.
 */
@NgModule({
  imports: [
    SharedModule,
    ImageRoutingModule
  ],
  providers: [
    ImageService,
    ImageResolveService
  ],
  declarations: [
    ImageComponent
  ]
})
export class ImageModule {

}
