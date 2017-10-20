import {Injectable} from "@angular/core";
import {PagingParams} from "../../vo/paging";
import {Observable} from "rxjs/Observable";
import {AppResponse} from "../../vo/app-response";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MY_MEDIA, MY_MEDIAS} from "../../constant/uri";
/**
 * Created by lzy on 2017/10/18.
 */
@Injectable()
export class MediaService {

  constructor(
    private http: HttpClient
  ){

  }
  medias(username:string, paging:PagingParams): Observable<AppResponse>{
    return this.http.get<AppResponse>(
      MY_MEDIAS,
      {
        params: new HttpParams().set('username', username).set('paging', JSON.stringify(paging))
      }
    ).map(
      data => {
        return data;
      }
    );
  }

  deleteMedia(id:string, username:string, paging: PagingParams):Observable<AppResponse>{
      return this.http.delete<AppResponse>(
        MY_MEDIA,
        {
          params: new HttpParams().set('id', id).set('paging', JSON.stringify(paging)).set('username', username)
        }
      ).map(
        data => {
          return data;
        }
      );
  }
}
