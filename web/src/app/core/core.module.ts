import {NgModule} from "@angular/core";
import {AuthorizationModule} from "./authorization/authorization.module";
import {StorageModule} from "./storage/storage.module";
import {SearchService} from "./search/search.service";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    AuthorizationModule,
    StorageModule
  ],
  providers:[SearchService],
  exports: [
    AuthorizationModule,
    StorageModule
  ]
})
export class CoreModule {

}
