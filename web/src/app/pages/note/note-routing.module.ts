import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {NoteComponent} from "./note.component";
import {NoteResolveService} from "./note-resolve.service";
/**
 * Created by lzy on 2017/10/7.
 */
const NOTE_ROUTERS: Routes = [
  {path: '', redirectTo: '/not-found', pathMatch: 'full'},
  {path: ':username', component: NoteComponent, resolve: {notes: NoteResolveService}}
];
@NgModule({
  imports: [RouterModule.forChild(NOTE_ROUTERS)],
  exports: [RouterModule]
})
export class NoteRoutingModule {

}
