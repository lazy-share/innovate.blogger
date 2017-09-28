import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Account} from "../vo/account";
import {HttpClient} from "@angular/common/http";
import {RegisterService} from "./register.service";
/**
 * Created by laizhiyuan on 2017/9/27.
 */
@Component({
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit{

  private account: Account;
  private showMsg: boolean = false;
  private isRepeatedAccount: boolean = false;
  private sysMsg: string = '';

  constructor(
    private router: Router,
    private registerService: RegisterService
  ){

  }

  ngOnInit(): void {
      this.account = new Account();
      this.account.username = "";
      this.account.password = "";
      this.account.encrypted = "";
      this.account.status = 0;
      this.account.confirmPassword = "";
      this.account.token = "";
  }

  register() {
      this.registerService.validate(this.account.username).subscribe(
        data => {
          if (!data.stutas) {
            this.sysMsg = "该账号已经被注册";
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
