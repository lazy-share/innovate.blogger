import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppResponse} from "../../vo/app-response";
import {ACCOUNT_INFO_ATTENTIONS} from "../../constant/uri";
/**
 * Created by lzy on 2017/10/2.
 */
@Injectable()
export class AttentionService {

  constructor(private http: HttpClient) {
  }

  attentions(username: string): Observable<any> {
    return this.http.get<AppResponse>(
      ACCOUNT_INFO_ATTENTIONS,
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
