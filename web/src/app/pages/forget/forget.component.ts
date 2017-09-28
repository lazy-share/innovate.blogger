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
  private confirmPassword:string;
  private encrypted:string;

  constructor(
    private forgetService: ForgetService
  ){
    super();
  }

  validateEncrypted(){
    this.forgetService.validateEncrypted(this.encrypted, this.username).subscribe(
      data => {
        if (!data.status){
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.isShow = true;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = "服务器错误";
      }
    );
  }

  forgetPwd(){

  }
}
