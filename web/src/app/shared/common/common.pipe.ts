import {PipeTransform, Pipe} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppResponse} from "../../vo/app-response";
import {ACCOUNT_INTERSPACENAME} from "../../constant/uri";
import {Observable} from "rxjs/Observable";
/**
 * Created by lzy on 2017/10/6.
 */
@Pipe({
  name: 'isExistsArr',
  pure: true
})
export class IsExistsArrPipe implements PipeTransform {

  transform(value: Array<any>, ele: string): boolean {
    if (!(value instanceof Array)){
      return false;
    }
    if (!value || value.length == 0 || !ele) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      if (value[i]._id == ele) {
        return true;
      }
    }
    return false;
  }
}


@Pipe({
  name: 'joinArr',
  pure: true
})
export class JoinArrPipe implements PipeTransform {

  transform(value: Array<string>, symbol: string): string {
    if (!value || value.length == 0) {
      return '';
    }
    if (!symbol) {
      symbol = ',';
    }
    return value.join(symbol);
  }
}

@Pipe({
  name: 'converToInterSpaceName',
  pure: true
})
export class ConverToInterSpaceNamePipe implements PipeTransform {

  constructor(public http: HttpClient){}
  transform(value: string): Observable<string> {

    return this.http.get<AppResponse>(
      ACCOUNT_INTERSPACENAME,
      {
        params: new HttpParams().set('account_id', value)
      }
    ).map(
      data => {
        if (!data.status){

        }else {
         return data.data;
        }
      }
    );
  }
}



