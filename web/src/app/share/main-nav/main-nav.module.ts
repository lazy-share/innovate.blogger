import {NgModule} from "@angular/core";
import {MainNavComponent} from "./main-nav.component";
import {CommonModule} from "@angular/common";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Account} from "../../pages/vo/account";
import {MainNavRoutingModule} from "./main-nav-routing.module";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  declarations: [
    MainNavComponent
  ],
  imports: [
    CommonModule,
    MainNavRoutingModule
  ],
  exports: [
    MainNavComponent
  ]
})
export class MainNavModule {

  private currentUser: Account;
  constructor(
    private authorizationService: AuthorizationService
  ){
    this.currentUser = authorizationService.getCurrentUser();
  }
}
