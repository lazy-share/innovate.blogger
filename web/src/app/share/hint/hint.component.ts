import {Component, Input} from "@angular/core";
import "rxjs/add/operator/switchMap";
/**
 * Created by laizhiyuan on 2017/9/28.
 */
@Component({
  selector: 'hint',
  templateUrl: "./hint.component.html"
})
export class HintComponent{
  @Input() private title:string = "";
  @Input() private content:string = "";
  @Input() private uri:string = "";

}
