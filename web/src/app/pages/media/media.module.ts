/**
 * Created by lzy on 2017/10/18.
 */
import {NgModule} from "@angular/core";
import {MediaRoutingModule} from "./media-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {MediaService} from "./media.service";
import {MediaResolveService} from "./media-resolve.service";
import {MediaComponent} from "./media.component";
@NgModule({
  imports: [
    SharedModule,
    MediaRoutingModule
  ],
  providers: [
    MediaService,
    MediaResolveService
  ],
  declarations: [
    MediaComponent
  ]
})
export class MediaModule {

}
