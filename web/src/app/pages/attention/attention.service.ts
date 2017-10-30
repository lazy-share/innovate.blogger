import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {AppResponse} from "../../vo/app-response";
import {MY_ATTENTIONS} from "../../constant/uri";
import {Router} from "@angular/router";
/**
 * Created by lzy on 2017/10/2.
 */
@Injectable()
export class AttentionService {

  constructor(public http: HttpClient, public router:Router) {
  }

  attentions(account_id: string): Observable<any> {
    return this.http.get<AppResponse>(
      MY_ATTENTIONS,
      {
        params: new HttpParams().set("account_id", account_id)
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
}
