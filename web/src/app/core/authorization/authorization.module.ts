import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from './authorization.service';
import {AuthorizationGuardService} from "./authorization-guard.service";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
  ],
  providers: [
    AuthorizationService,
    AuthorizationGuardService
  ],
  entryComponents: [
  ]
})
export class AuthorizationModule {

}
