import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Observable} from "rxjs/Observable";
import {LOGIN} from "../constant/uri";
import {AppResponse} from "../vo/app-response";
/**
 * Created by laizhiyuan on 2017/9/28.
 */
@Injectable()
export class LoginService {

  constructor(
    private http: HttpClient,
    private authorizationService:AuthorizationService
  ){

  }

  login(userInfo: {username: string, password: string}) : Observable<any> {
      const authService = this.authorizationService;
      return this.http.post<AppResponse>(LOGIN, userInfo).map(
        data => {
          if (data.status){
            authService.setCurrentUser(data.data);
          }
          return data;
        }
      );
  }
}
