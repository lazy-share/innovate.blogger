import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {AppResponse} from "../../vo/app-response";
import {ACCOUNT_INFO_FANS, ACCOUNT_INFO_ATTENTION} from "../../constant/uri";
import {Router} from "@angular/router";
/**
 * Created by lzy on 2017/10/2.
 */
@Injectable()
export class FansService {

  constructor(private http: HttpClient,private router:Router) {
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
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.router.navigate(['system-error',{msg: err.error.message}]);
        } else {
          this.router.navigate(['system-error',{msg: err.error}],);
        }
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
