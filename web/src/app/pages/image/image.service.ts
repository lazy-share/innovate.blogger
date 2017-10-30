import {Injectable} from "@angular/core";
import {HttpClient, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {PagingParams} from "../../vo/paging";
import {AppResponse} from "../../vo/app-response";
import {MY_IMAGES,MY_IMAGE, MY_IMAGE_PRAISE, MY_IMAGE_COMMENT} from "../../constant/uri";
import {Router} from "@angular/router";
import {Reply} from "../../vo/comment";
import {Image} from "../../vo/image";
/**
 * Created by lzy on 2017/10/28.
 */
@Injectable()
export class ImageService {
  constructor(
    public http: HttpClient,
    public router:Router
  ){}

  praise(requestAccountId:string, currentUsername: string, id: string, paging: PagingParams): Observable<AppResponse> {
    return this.http.post<AppResponse>(
      MY_IMAGE_PRAISE,
      {account_id: requestAccountId, from: currentUsername, id: id, paging: paging}
    ).map(
      data => {
        return data;
      }
    );
  }

  delConment(reply:Reply, paging: PagingParams): Observable<AppResponse> {
    return this.http.delete<AppResponse>(
      MY_IMAGE_COMMENT,
      {
        params: new HttpParams().set("reply", JSON.stringify(reply)).set('paging', JSON.stringify(paging))
      }
    ).map(
      data => {
        return data;
      }
    );
  }

  deleteImage(note: Image, paging: PagingParams): Observable<AppResponse> {
    return this.http.delete<AppResponse>(
      MY_IMAGE,
      {
        params: new HttpParams().set('image', JSON.stringify(note)).set('paging', JSON.stringify(paging))
      }
    ).map(
      data => {
        return data;
      }
    );
  }

  submitConment(reply:Reply, paging: PagingParams): Observable<AppResponse> {
    return this.http.post<AppResponse>(
      MY_IMAGE_COMMENT,
      {reply: reply, paging: paging}
    ).map(
      data => {
        return data;
      }
    );
  }

  images(account_id:string, currentUsername:string, paging:PagingParams):Observable<any>{
    return this.http.get<AppResponse>(
      MY_IMAGES,
      {
        params: new HttpParams().set('account_id', account_id).set('currentUsername', currentUsername).set('paging', JSON.stringify(paging))
      }
    ).map(
      data => {
        return data;
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.router.navigate(['system-error', {msg: err.error.message}]);
        } else {
          this.router.navigate(['system-error', {msg: err.error}],);
        }
      }
    )
  }

}
