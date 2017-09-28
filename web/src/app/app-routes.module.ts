import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {NotFoundComponent} from "./share/not-found/not-found.component";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
const APP_ROUTES: Routes = [
  {path: 'home', loadChildren: 'app/pages/home/home.module#HomeModule'},
  {path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule'},
  {path: "register", loadChildren: 'app/pages/register/register.module#RegisterModule'},
  {path: 'forget', loadChildren: 'app/pages/forget/forget.module#ForgetModule'},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}
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
