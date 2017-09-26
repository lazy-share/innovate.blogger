import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
const APP_ROUTES: Routes = [
  {path: 'home', loadChildren: 'app/pages/home/home.module#HomeModule'},
 /* {path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule'},*/
  {path: '', redirectTo: 'home', pathMatch: 'full'}
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
