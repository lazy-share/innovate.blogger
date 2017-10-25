import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {FansService} from "./fans.service";
/**
 * Created by lzy on 2017/10/7.
 */
@Injectable()
export class FansResolveService implements Resolve<any>{

  constructor(
    public fansService:FansService
  ){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let username = route.paramMap.get("username");
    return this.fansService.fans(username);
  }

}
