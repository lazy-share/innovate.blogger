import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {MediaService} from "./media.service";
import {PagingParams} from "../../vo/paging";
/**
 * Created by lzy on 2017/10/18.
 */
@Injectable()
export class MediaResolveService implements Resolve<any> {

  constructor(public mediaService:MediaService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let account_id = route.paramMap.get('account_id');
    let paging = PagingParams.instantiation();
    paging.limit = 6;
    return this.mediaService.medias(account_id, paging);
  }

}
