import {Injectable} from "@angular/core";
import {HttpClient, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {AppResponse} from "../../vo/app-response";
import {MY_VISITORS} from "../../constant/uri";
import {Router} from "@angular/router";
/**
 * Created by lzy on 2017/10/6.
 */
@Injectable()
export class VisitorService {

  constructor(
    private http:HttpClient,
    private router:Router
  ){

  }

  visitors(username:string):Observable<any> {
    return this.http.get<AppResponse>(
      MY_VISITORS,
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
}
