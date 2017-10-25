import {enableProdMode} from "@angular/core";
import {environment} from "./environments/environment";
import {AppModuleNgFactory} from "../aot/src/app/app.module.ngfactory";
import {platformBrowser} from "@angular/platform-browser";

if (environment.production) {
  enableProdMode();
}

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
