import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
const APP_ROUTES: Routes = [
  {path: '', loadChildren: 'app/pages/home/home.module#HomeModule'}
];
@NgModule({
  imports: [
    RouterModule.forRoot(
      APP_ROUTES,
      { enableTracing: true }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutesModule {

}
