import {Injectable} from "@angular/core";
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {NoteService} from "./note.service";
import {PagingParams} from "../../vo/paging";
import {AuthorizationService} from "../../core/authorization/authorization.service";
/**
 * Created by lzy on 2017/10/7.
 */
@Injectable()
export class NoteResolveService implements Resolve<any>{

  constructor(
    private noteService: NoteService,
    private authorizationService: AuthorizationService
  ){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let requestUsername = route.paramMap.get('username');
    let currentUsername = this.authorizationService.getCurrentUser().username;
    return this.noteService.notes(requestUsername, currentUsername, PagingParams.instantiation());
  }

}
