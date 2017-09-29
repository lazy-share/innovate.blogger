import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FORGET, FORGET_VALIDATE} from "../constant/uri";
import {AppResponse} from "../vo/app-response";
/**
 * Created by laizhiyuan on 2017/9/28.
 */
@Injectable()
export class ForgetService {

  constructor(private http: HttpClient) {
  }

  validateEncrypted(encrypted: string, username: string): Observable<any> {
    return this.http.get<AppResponse>(
      FORGET_VALIDATE,
      {
        params: new HttpParams().set('encrypted', encrypted).set('username', username),
        responseType: 'json'
      }
    ).map(
      data => {
        return data;
      }
    );
  }

  forgetPwd(username: string, password: string): Observable<any>{
    return this.http.put(
      FORGET,
      {username: username, password: password},
      {responseType: 'json'}
    ).map(
      data => {
        return data;
      }
    );
  }
}
