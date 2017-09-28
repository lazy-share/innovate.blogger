import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {AppResponse} from "../vo/app-response";
import {REGISTER, REGISTER_VILIDATE} from "../constant/uri";
import {Account} from "../vo/account";
/**
 * Created by laizhiyuan on 2017/9/28.
 */
@Injectable()
export class RegisterService {

  constructor(private http: HttpClient) {
  }

  validate(username: string): Observable<any> {

    console.log("============register validate request:" + username);
    return this.http.get<AppResponse>(
      REGISTER_VILIDATE ,
      {
        params: new HttpParams().set('username', username),
        responseType: 'json'
      }
    ).map(
      data => {
        console.log("============register validate response:" + JSON.stringify(data));
        return data;
      })
  }

  register(account: Account): Observable<any> {
    console.log("============register request:" + JSON.stringify(account));
    return this.http.post(
      REGISTER,
      {account: account}
    ).map(
      data => {
        console.log("============register response:" + data);
        return data;
      }
    )
  }

}
