import {Routes,RouterModule} from "@angular/router";
import {ImageComponent} from "./image.component";
import {ImageResolveService} from "./image-resolve.service";
import {NgModule} from "@angular/core";
/**
 * Created by lzy on 2017/10/28.
 */
const IMAGE_ROUTERS: Routes = [
  {path: '', redirectTo: '/not-found', pathMatch:'full'},
  {path: ':account_id', component: ImageComponent, resolve: {images: ImageResolveService}}
];

@NgModule({
  imports: [
    RouterModule.forChild(IMAGE_ROUTERS)
  ],
  exports: [
    RouterModule
  ]
})
export class ImageRoutingModule {

}
