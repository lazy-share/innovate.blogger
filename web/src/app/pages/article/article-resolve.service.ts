import {Injectable} from "@angular/core";
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ArticleService} from "./article.service";
import {PagingParams} from "../../vo/paging";
import {AuthorizationService} from "../../core/authorization/authorization.service";
/**
 * Created by lzy on 2017/10/12.
 */
@Injectable()
export class ArticleResolveService implements Resolve<any>{

  constructor(
    public articliService:ArticleService,
    public authorizationService:AuthorizationService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let account_id = route.paramMap.get('account_id');
    let paging = PagingParams.instantiation();
    return this.articliService.articles(account_id, this.authorizationService.getCurrentUser()._id, false,  paging);
  }

}
