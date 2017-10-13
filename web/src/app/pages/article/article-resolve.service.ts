import {Injectable} from "@angular/core";
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {Article} from "../../vo/article";
import {Observable} from "rxjs";
/**
 * Created by lzy on 2017/10/12.
 */
@Injectable()
export class ArticleResolveService implements Resolve<Article>{

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Article> {
    return undefined;
  }

}
