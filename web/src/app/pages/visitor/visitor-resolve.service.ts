import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {VisitorService} from "./visitor.service";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
/**
 * Created by lzy on 2017/10/7.
 */
@Injectable()
export class VisitorResolveService implements Resolve<any>{


  constructor(
    public visitorService:VisitorService
  ){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let username = route.paramMap.get("username");
    return this.visitorService.visitors(username);
  }

}
