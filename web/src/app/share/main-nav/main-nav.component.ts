import {Component} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Account} from "../../pages/vo/account";
import {Router} from "@angular/router";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  constructor(
    private authorizationService: AuthorizationService,
    private route: Router
  ){
  }

  logout() {
    this.authorizationService.logout();
    this.route.navigate(['/login']);
  }
}

