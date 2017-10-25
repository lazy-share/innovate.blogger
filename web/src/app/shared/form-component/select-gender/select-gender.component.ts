import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
/**
 * Created by laizhiyuan on 2017/9/30.
 */
@Component({
  selector: 'select-gender',
  templateUrl: './select-gender.component.html'
})
export class SelectGenderComponent {

  @Input() public gender: number | string = "";
  @Input() public isDisabled: boolean = false;
  @Input() public componentId:string = 'gender';
  @Output() onChange = new EventEmitter<number|string>();

  change() {
    this.onChange.emit(this.gender);
  }

  public genders: {key:string, val: string|number}[] = [{key: '--请选择--', val: ''},{key: '男', val: 0}, {key: '女', val: 1}];

}
