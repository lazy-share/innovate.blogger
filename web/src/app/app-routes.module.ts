import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {IllegalRequestComponent, NotFoundComponent} from "./share/common/common.component";
import {CenterComponent} from "./share/center/center.component";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
const APP_ROUTES: Routes = [
  {path: 'home', loadChildren: 'app/pages/home/home.module#HomeModule'},
  {path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule'},
  {path: "register", loadChildren: 'app/pages/register/register.module#RegisterModule'},
  {path: 'forget', loadChildren: 'app/pages/forget/forget.module#ForgetModule'},
  {path: 'center',
    children: [
      {path: '', redirectTo: 'illegal', pathMatch: 'full'},
      {path: ':sign',
      children: [
        {path: '',  component: CenterComponent},
        {path: 'info', loadChildren: 'app/pages/info/info.module#InfoModule'}
      ]
      }
    ]
  },
  {path: 'illegal', component: IllegalRequestComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'not-found'}
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
