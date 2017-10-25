import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {AppResponse} from "../../vo/app-response";
import {REGISTER, REGISTER_VILIDATE} from "../../constant/uri";
import {Account} from "../../vo/account";
/**
 * Created by laizhiyuan on 2017/9/28.
 */
@Injectable()
export class RegisterService {

  constructor(public http: HttpClient) {
  }

  validate(username: string): Observable<any> {

    return this.http.get<AppResponse>(
      REGISTER_VILIDATE ,
      {
        params: new HttpParams().set('username', username),
        responseType: 'json'
      }
    ).map(
      data => {
        return data;
      })
  }

  register(account: Account): Observable<any> {
    return this.http.post(
      REGISTER,
      {account: account}
    ).map(
      data => {
        return data;
      }
    )
  }

}
