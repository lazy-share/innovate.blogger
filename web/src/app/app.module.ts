import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CoreModule} from "./core/core.module";
import {ShareModule} from "./share/share.module";
import {AppRoutesModule} from "./app-routes.module";

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
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
