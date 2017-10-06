import {Injectable} from "@angular/core";
import {Account} from "../../vo/account";
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {InfoService} from "./info.service";
/**
 * Created by lzy on 2017/10/6.
 */
@Injectable()
export class InfoResolverService implements Resolve<Account>{

  constructor(
    private infoService: InfoService,
    private router:Router
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Account>{
    let username = route.paramMap.get("username");
    return this.infoService.initAccountInfo(username);
  }

}
