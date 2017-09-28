import {Component} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Account} from "../../pages/vo/account";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {
  private currentUser: Account;

  constructor(
    private authorizationService: AuthorizationService
  ){
    this.currentUser = authorizationService.getCurrentUser();
  }
}

