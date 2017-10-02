import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ACCOUNT_INFO} from "../../../constant/uri";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@Injectable()
export class InfoService {

  constructor(
    private http: HttpClient
  ){}

  initAccountInfo(username: string): Observable<any> {
    return this.http.get(
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
}
