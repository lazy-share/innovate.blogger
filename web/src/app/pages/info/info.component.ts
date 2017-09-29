import {Component, OnInit} from "@angular/core";
import "rxjs/add/operator/switchMap";
import {InfoService} from "./info.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {BaseComponent} from "../common/BaseComponent";
import {Account} from "../vo/account";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@Component({
  templateUrl: './info.component.html',
  styleUrls: [
    './info.component.css'
  ]
})
export class InfoComponent extends BaseComponent implements OnInit {

  private requestUsername: string = "";
  private storageUsername: string = "";
  private accountInfo: Account = Account.instantiation();

  constructor(private authorizationService: AuthorizationService,
              private route: ActivatedRoute,
              private router: Router,
              private infoService: InfoService) {
    super();
    this.storageUsername = this.authorizationService.getCurrentUser()
      && this.authorizationService.getCurrentUser().username;
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
  }

  ngOnInit(): void {
    this.infoService.initAccountInfo(this.requestUsername).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.accountInfo = data.data;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

}
