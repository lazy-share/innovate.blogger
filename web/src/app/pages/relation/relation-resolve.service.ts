import {Resolve} from "@angular/router";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {RouterStateSnapshot, Router, ActivatedRouteSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
/**
 * Created by lzy on 2017/10/29.
 */
@Injectable()
export class RelationResolveService implements Resolve<any>{
  constructor(
    public authorizationService: AuthorizationService,
    public router: Router
  ){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    let requestAccountId = route.paramMap.get('account_id');
    if (requestAccountId != this.authorizationService.currentUser._id){
      this.router.navigate(['not-ultra-vires']);
    }
    return true;
  }

}
