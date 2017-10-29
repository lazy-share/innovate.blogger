import {Injectable} from "@angular/core";
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router, CanActivateChild} from "@angular/router";
import {AuthorizationService} from "./authorization.service";
import {SearchService} from "../search/search.service";
import {AppResponse} from "../../vo/app-response";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MY_RELATION_COUNT} from "../../constant/uri";
/**
 * Created by lzy on 2017/10/7.
 */
@Injectable()
export class AuthorizationGuardService implements CanActivate, CanActivateChild{

  constructor(
    public authorizationService:AuthorizationService,
    public searchService:SearchService,
    public router:Router,
    public http:HttpClient
  ){}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.searchService.confirmMission(false); //进入前关闭搜索框
    if (!this.authorizationService.getCurrentUser()){
      this.authorizationService.currentUser = null;
      this.authorizationService.logout();
      this.router.navigate(['login']);
    }
    var requestUsername = childRoute.paramMap.get('username');
    if (requestUsername != '' && requestUsername != null && requestUsername != undefined){
      this.http.get<AppResponse>(
        MY_RELATION_COUNT,
        {
          params: new HttpParams().set('username', requestUsername)
        }
      ).subscribe(
        data => {
          if (data.status){
            this.authorizationService.setRelationCount(data.data);
          }
        }
      );
    }
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.searchService.confirmMission(false); //进入前关闭搜索框
    if (this.authorizationService.getCurrentUser()){
      return true;
    }else {
      let path = route.url[0].path;
      this.authorizationService.logout();
      if (path == 'home'){
        return true;
      }
      this.router.navigate(['login']);
    }

    return false;
  }

}
