import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {InfoComponent} from "../info/info.component";
import {CenterComponent} from "./center.component";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
const CENTER_ROUTES: Routes = [
  {path: 'test/:id', component: InfoComponent},
  {path: '', children: [
    {path: 'test/:id', component: InfoComponent},
    {path: ':username', component: CenterComponent}
  ]},
];
@NgModule({
  imports: [RouterModule.forChild(CENTER_ROUTES)],
  exports: [RouterModule]
})
export class CenterRoutingModule {

}
