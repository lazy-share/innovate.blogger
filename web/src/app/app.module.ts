import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CoreModule} from "./core/core.module";
import {ShareModule} from "./share/share.module";
import {AppRoutesModule} from "./app-routes.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {APPRequestInterceptor, APPResponseInterceptor} from "./app.intercept";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ShareModule,
    AppRoutesModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: APPRequestInterceptor,
    multi: true,
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: APPResponseInterceptor,
    multi: true,
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
