import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {AppResponse} from "../../vo/app-response";
import {ACCOUNT_INTERSPACENAME} from "../../constant/uri";
/**
 * Created by laizhiyuan on 2017/11/1.
 */
@Injectable()
export class ToInterspaceNameService {

  constructor(
    public http: HttpClient
  ){}

  toInterspaceName(id: string):Observable<AppResponse>{
      return this.http.get<AppResponse>(
        ACCOUNT_INTERSPACENAME,
        {
          params: new HttpParams().set('account_id', id)
        }
      ).map(
        data => {
          return data;
        }
      )
  }
}
