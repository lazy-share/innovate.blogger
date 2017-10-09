import {PipeTransform, Pipe} from "@angular/core";
/**
 * Created by lzy on 2017/10/6.
 */
@Pipe({name: 'isExistsArr'})
export class IsExistsArrPipe implements PipeTransform {

  transform(value: Array<string>, ele: string): boolean {
    if (!value || value.length == 0 || !ele) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      if (value[i] == ele) {
        return true;
      }
    }
    return false;
  }
}


@Pipe({name: 'joinArr'})
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

