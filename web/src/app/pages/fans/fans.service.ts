import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppResponse} from "../../vo/app-response";
import {ACCOUNT_INFO_ATTENTIONS, ACCOUNT_INFO_FANS, ACCOUNT_INFO_ATTENTION} from "../../constant/uri";
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

  fans(username: string): Observable<any> {
    return this.http.get<AppResponse>(
      ACCOUNT_INFO_FANS,
      {
        params: new HttpParams().set("username", username)
      }
    ).map(
      data => {
        return data;
      }
    );
  }

  attention(subject: string, from: string): Observable<any> {
    return this.http.post<AppResponse>(
      ACCOUNT_INFO_ATTENTION,
      {subject: subject, from: from}
    ).map(
      data => {
        return data;
      }
    );
  }

  cancleAttention(subject: string, from: string): Observable<any> {
    return this.http.delete<AppResponse>(
      ACCOUNT_INFO_ATTENTION,
      {
        params: new HttpParams().set("subject", subject).set("from", from)
      }
    ).map(
      data => {
        return data;
      }
    );
  }
}
