import {Component, Input} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@Component({
  selector: 'sub-nav',
  templateUrl: './sub-nav.component.html',
  styleUrls: [
    './sub-nav.component.css'
  ]
})
export class SubNavComponent {

  @Input() public requestAccountId:string;
  @Input() public tab:string = "0";

  constructor(
    public authorizationService:AuthorizationService
  ){

  }
}
