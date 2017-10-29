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
    let requestUsername = route.paramMap.get('username');
    if (requestUsername != this.authorizationService.getCurrentUser().username){
      this.router.navigate(['not-ultra-vires']);
    }
    return true;
  }

}
