import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ACCOUNT_INFO} from "../../constant/uri";
import {AppResponse} from "../../vo/app-response";
import {Account} from "../../vo/account";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@Injectable()
export class InfoService {

  constructor(
    private http: HttpClient
  ){}

  initAccountInfo(username: string): Observable<any> {
    return this.http.get<AppResponse>(
      ACCOUNT_INFO,
      {
        params: new HttpParams().set("username", username)
      }
    ).map(
      data => {
        return data;
      }
    );
  }

  confirmEdit(accountInfo: Account): Observable<any> {
    return this.http.put<AppResponse>(
      ACCOUNT_INFO,
      {
        params: new HttpParams().set("accountInfo", JSON.stringify(accountInfo))
      }
    ).map(
      data => {
        return data;
      }
    );
  }
}
