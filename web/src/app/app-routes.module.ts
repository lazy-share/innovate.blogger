import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {
  IllegalRequestComponent, NotFoundComponent, NotFoundAccountComponent,
  SystemErrorComponent
} from "./shared/common/common.component";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
const APP_ROUTES: Routes = [
  {path: 'home', loadChildren: 'app/pages/home/home.module#HomeModule'},
  {path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule'},
  {path: "register", loadChildren: 'app/pages/register/register.module#RegisterModule'},
  {path: 'forget', loadChildren: 'app/pages/forget/forget.module#ForgetModule'},
  {
    path: 'private',
    children: [
      {path: '', redirectTo: 'not-found', pathMatch: 'full'},
      {path: 'info', loadChildren: 'app/pages/info/info.module#InfoModule'},
      {path: 'attention', loadChildren: 'app/pages/attention/attention.module#AttentionModule'},
      {path: 'fans', loadChildren: 'app/pages/fans/fans.module#FansModule'}
    ]
  },
  {path: 'illegal', component: IllegalRequestComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'not-account', component: NotFoundAccountComponent},
  {path: 'system-error', component: SystemErrorComponent},
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
