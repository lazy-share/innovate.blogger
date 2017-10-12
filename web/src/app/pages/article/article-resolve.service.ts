import {Injectable} from "@angular/core";
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {Articles} from "../../vo/articles";
import {Observable} from "rxjs";
/**
 * Created by lzy on 2017/10/12.
 */
@Injectable()
export class ArticleResolveService implements Resolve<Articles>{

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Articles> {
    return undefined;
  }

}
