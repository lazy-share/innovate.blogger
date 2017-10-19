import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MediaComponent} from "./media.component";
import {MediaResolveService} from "./media-resolve.service";
/**
 * Created by lzy on 2017/10/18.
 */
const MEDIA_ROUTERS : Routes = [
  {path: '', redirectTo: '/not-found', pathMatch: 'full'},
  {path: ':username', component: MediaComponent, resolve: {medias: MediaResolveService}}
];
@NgModule({
  imports: [RouterModule.forChild(MEDIA_ROUTERS)],
  exports: [RouterModule]
})
export class MediaRoutingModule {

}
