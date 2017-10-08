import {NoteComponent} from "./note.component";
import {NoteService} from "./note.service";
import {SharedModule} from "../../shared/shared.module";
import {NoteRoutingModule} from "./note-routing.module";
import {NoteResolveService} from "./note-resolve.service";
import {NgModule} from "@angular/core";
/**
 * Created by lzy on 2017/10/7.
 */
@NgModule({
  declarations: [
    NoteComponent
  ],
  providers: [
    NoteService,
    NoteResolveService
  ],
  imports: [
    SharedModule,
    NoteRoutingModule
  ]
})
export class NoteModule {

}
