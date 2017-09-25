import {NgModule} from "@angular/core";
import {AuthorizationModule} from "./authorization/authorization.module";
import {StorageModule} from "./storage/storage.module";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    AuthorizationModule,
    StorageModule
  ],
  providers:[],
  exports: [
    AuthorizationModule,
    StorageModule
  ]
})
export class CoreModule {

}
