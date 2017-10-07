import {Injectable} from "@angular/core";
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {AttentionService} from "./attention.service";
import {Observable} from "rxjs";
/**
 * Created by lzy on 2017/10/7.
 */
@Injectable()
export class AttentionResolveService implements Resolve<any>{

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>{
    let username = route.paramMap.get("username");
    return this.attentionService.attentions(username);
  }

  constructor(
    private attentionService:AttentionService
  ){

  }
}
