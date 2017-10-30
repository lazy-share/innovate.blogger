import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {ImageService} from "./image.service";
import {Observable} from "rxjs";
import {PagingParams} from "../../vo/paging";
import {AuthorizationService} from "../../core/authorization/authorization.service";
/**
 * Created by lzy on 2017/10/28.
 */
@Injectable()
export class ImageResolveService implements Resolve<any>{
  constructor(
    public imageService:ImageService,
    public authorizationService: AuthorizationService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let requestAccountId = route.paramMap.get('account_id');
    let currentUsername = this.authorizationService.getCurrentUser().account_id;
    return this.imageService.images(requestAccountId, currentUsername, PagingParams.instantiation4());
  }

}
