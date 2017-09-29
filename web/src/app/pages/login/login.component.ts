import {Component} from "@angular/core";
import {LoginService} from "./login.service";
import {Router} from "@angular/router";
/**
 * Created by lzy on 2017/9/26.
 */
@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {

  private username:string = "";
  private password:string = "";
  private showMsg:boolean = false;
  private sysMsg:string = "";

  constructor(
    private loginService: LoginService,
    private route: Router
  ){}

  login(){
    this.loginService.login({username: this.username, password: this.password}).subscribe(
      data => {
        if (!data.status){
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.route.navigate([`/center/${data.data.username}`]);
      },
      err => {
        this.showMsg = true;
        this.sysMsg = "服务器错误";
      }
    )
  }

}
