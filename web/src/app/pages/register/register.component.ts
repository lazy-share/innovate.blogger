import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Account} from "../vo/account";
/**
 * Created by laizhiyuan on 2017/9/27.
 */
@Component({
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit{

  private account: Account;
  constructor(
    private router: Router
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

  }

  home(){
    this.router.navigate(['/home']);
  }

}
