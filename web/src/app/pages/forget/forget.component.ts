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
  public username:string;
  public password:string;
  public confirmPassword:string;
  public encrypted:string;

  constructor(
    public forgetService: ForgetService,
    public router: Router
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
