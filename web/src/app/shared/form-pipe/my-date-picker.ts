import {PipeTransform, Pipe} from "@angular/core";
import {MyDatePicker} from "../../vo/my-date-picker";
import {Utils} from "../../utils/utils";
/**
 * Created by lzy on 2017/10/6.
 */
@Pipe({name: 'mydatepicker'})
export class MyDatePickerPipe implements PipeTransform{

  transform(value: MyDatePicker, format: string): string {
    if (!value || !value.date){
      return '';
    }
    let result:string = value.date.year + '-'  + value.date.month +  '-'  + value.date.day;
    let transform = new Date(result);
    if (!format) {
      format = 'yyyy-MM-dd';
    }
    return Utils.fmtDate(transform, format);
  }

}
