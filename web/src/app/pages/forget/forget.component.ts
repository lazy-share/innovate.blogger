import {Component} from "@angular/core";
import {ForgetService} from "./forget.service";
import {BaseComponent} from "../common/BaseComponent";
/**
 * Created by laizhiyuan on 2017/9/28.
 */
@Component({
  templateUrl: "./forget.component.html",
  styleUrls: ["./forget.component.css"]
})
export class ForgetComponent extends BaseComponent{
  private username:string;
  private password:string;
  private encrypted:string;

  constructor(
    private forgetService: ForgetService
  ){
    super();
  }

  validateEncrypted(){

  }

  updatePwd(){

  }
}
