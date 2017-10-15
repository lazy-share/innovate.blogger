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
    private articliService:ArticleService,
    private authorizationService:AuthorizationService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let username = route.paramMap.get('username');
    let paging = PagingParams.instantiation();
    paging.limit = 10;
    return this.articliService.articles(username, this.authorizationService.getCurrentUser().username,  paging);
  }

}
