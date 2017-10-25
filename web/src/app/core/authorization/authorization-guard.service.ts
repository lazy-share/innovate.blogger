import {Injectable} from "@angular/core";
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router, CanActivateChild} from "@angular/router";
import {AuthorizationService} from "./authorization.service";
import {SearchService} from "../search/search.service";
/**
 * Created by lzy on 2017/10/7.
 */
@Injectable()
export class AuthorizationGuardService implements CanActivate, CanActivateChild{

  constructor(
    public authorizationService:AuthorizationService,
    public searchService:SearchService,
    public router:Router
  ){}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.searchService.confirmMission(false); //进入前关闭搜索框
    if (this.authorizationService.getCurrentUser()){
      return true;
    }else {
      this.router.navigate(['login']);
    }

    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.searchService.confirmMission(false); //进入前关闭搜索框
    if (this.authorizationService.getCurrentUser()){
      return true;
    }else {
      this.router.navigate(['login']);
    }

    return false;
  }

}
