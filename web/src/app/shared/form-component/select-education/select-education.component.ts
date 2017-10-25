import {Component, EventEmitter, Input, Output} from "@angular/core";
/**
 * Created by laizhiyuan on 2017/9/30.
 */
@Component({
  selector: 'select-education',
  templateUrl: './select-education.component.html'
})
export class SelectEducationComponent {

  public educations = [{key: '--请选择--', val: ''}, {key: '中专/高中', val: 1}, {key: '大专', val: 2}, {key: '本科', val: 3}, {key: '研究生', val: 4}, {key: '博士', val: 5}, {key: '博士后', val: 6}, {key: '其它', val: 7}];
  @Input() public education: string| number = "";
  @Input() public isDisabled: boolean = false;
  @Input() public componentId:string = 'education';
  @Output() onChange = new EventEmitter<number|string>();

  change() {
    this.onChange.emit(this.education);
  }

}
