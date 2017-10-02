import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Account} from "../../vo/account";
import {RegisterService} from "./register.service";
import {BaseComponent} from "../common/BaseComponent";
/**
 * Created by laizhiyuan on 2017/9/27.
 */
@Component({
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent extends BaseComponent implements OnInit{

  private account: Account;
  private isRepeatedAccount: boolean = false;
  private validateMsg:string = "";

  constructor(
    private router: Router,
    private registerService: RegisterService
  ){
    super();
  }

  ngOnInit(): void {
      this.account = Account.instantiation();
  }

  register() {
      this.registerService.validate(this.account.username).subscribe(
        data => {
          if (!data.status) {
            this.validateMsg = "该账号已经被注册";
            this.isRepeatedAccount = true;
            return;
          }
          this.registerService.register(this.account).subscribe(
            data => {
              if (!data.status){
                this.sysMsg = data.msg;
                this.showMsg = true;
                return;
              }
              this.router.navigate(['/register/success']);
            },
            err => {
              console.log(err);
              this.sysMsg = '服务器错误';
              this.showMsg = true;
            }
          );
        },
        err => {
          console.log(err);
          this.sysMsg = '服务器错误';
          this.showMsg = true;
        }
      );
  }

  home(){
    this.router.navigate(['/home']);
  }

}
