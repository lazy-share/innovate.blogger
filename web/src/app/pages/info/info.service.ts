import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";
import {GET_ACCOUNT_INFO_BY_USERNAME} from "../constant/uri";
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
      GET_ACCOUNT_INFO_BY_USERNAME,
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
