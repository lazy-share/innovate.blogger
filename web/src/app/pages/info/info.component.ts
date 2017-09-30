import {Component, OnInit} from "@angular/core";
import {BaseComponent} from "../common/BaseComponent";
import {Account} from "../vo/account";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {InfoService} from "./info.service";
import {environment} from "../../../environments/environment";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
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
  private bsConfig: Partial<BsDatepickerConfig>;
  minDate: Date = new Date('1880/01/01');
  maxDate: Date = new Date();

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
    this.bsConfig = Object.assign({}, {locale: 'zh-cn',containerClass: 'theme-blue'});
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.infoService.initAccountInfo(this.requestUsername).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.accountInfo = data.data;
        this.initAccountInfo();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  initAccountInfo() {
    if (!this.accountInfo.head_portrait) {
      this.accountInfo.head_portrait = 'http://' + environment.api.host + ':' + environment.api.port + '/public/web/images/header/initHead.jpg';
    }
    if (!this.accountInfo.gender) {
      this.accountInfo.gender = '';
    }
    if (!this.accountInfo.education){
      this.accountInfo.education = "";
    }
    this.accountInfo.birthday = "02/05/2015"
  }

  genderChange(val: number|string) {
    this.accountInfo.gender = val;
  }

  educationChange(val: number|string) {
    this.accountInfo.education = val;
  }

}
