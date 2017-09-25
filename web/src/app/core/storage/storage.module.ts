import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_STORAGE_PROVIDERS } from './storage.service';
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
    APP_STORAGE_PROVIDERS
  ],
  entryComponents: [
  ]
})
export class StorageModule {

}
