import {Injectable} from "@angular/core";
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from "@angular/router";
import {AuthorizationService} from "./authorization.service";
/**
 * Created by lzy on 2017/10/7.
 */
@Injectable()
export class AuthorizationGuardService implements CanActivate{

  constructor(
    private authorizationService:AuthorizationService,
    private router:Router
  ){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authorizationService.getCurrentUser()){
      return true;
    }else {
      this.router.navigate(['login']);
    }

    return false;
  }

}
