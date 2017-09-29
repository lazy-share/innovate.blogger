import {Component} from "@angular/core";
import {ForgetService} from "./forget.service";
import {BaseComponent} from "../common/BaseComponent";
import {Router} from "@angular/router";
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
    private forgetService: ForgetService,
    private router: Router
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
        this.showMsg = false;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = "服务器错误";
      }
    );
  }

  forgetPwd(){
    this.forgetService.forgetPwd(this.username, this.password).subscribe(
      data => {
        if (!data.status){
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.router.navigate(['/forget/success']);
      },
      err => {
        this.showMsg = true;
        this.sysMsg = "服务器错误";
      }
    );
  }
}
