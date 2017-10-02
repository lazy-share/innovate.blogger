import {Component, OnInit} from "@angular/core";
import {BaseComponent} from "../common/BaseComponent";
import {Account} from "../../vo/account";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {InfoService} from "./info.service";
import {environment} from "../../../environments/environment";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {AppResponse} from "../../vo/app-response";
import {FileUploader, FileItem, ParsedResponseHeaders} from "ng2-file-upload";
import {ACCOUNT_INFO_HEADER} from "../../constant/uri";
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
  private bsConfig: Partial<BsDatepickerConfig> = Object.assign({},
    {
      locale: 'zhCn',
      containerClass: 'theme-blue',
      showWeekNumbers: false
    }
  );
  minDate = new Date(1900, 1, 1);
  maxDate = new Date(2050, 1, 1);
  uploader: FileUploader = new FileUploader({});


  constructor(private authorizationService: AuthorizationService,
              private route: ActivatedRoute,
              private router: Router,
              private infoService: InfoService) {
    super();
    this.storageUsername = this.authorizationService.getCurrentUser() && this.authorizationService.getCurrentUser().username;
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
    this.uploader = new FileUploader({
      url: environment.api.uri + ACCOUNT_INFO_HEADER + '/' + this.requestUsername,
      itemAlias: "uploadfile",
      headers: [
        {name: "LzyAuthorization", value: this.authorizationService.getCurrentUser().token}
      ],
      removeAfterUpload: true,
      autoUpload: true
    });
    this.uploader.onSuccessItem = this.successItem.bind(this);
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
        this.initAccountInfo();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  initAccountInfo() {
    if (this.accountInfo.gender === null || this.accountInfo.gender === undefined) {
      this.accountInfo.gender = '';
    }
    if (this.accountInfo.education === null || this.accountInfo.education === undefined) {
      this.accountInfo.education = '';
    }
  }

  edit() {
    this.isShow = true;
  }

  confirmEdit() {
    this.infoService.confirmEdit(this.accountInfo).subscribe(
      data => {
        if (data.status) {
          this.isShow = false;
          this.showMsg = false;
        } else {
          this.showMsg = true;
          this.sysMsg = data.msg;
        }
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  genderChange(val: number|string) {
    this.accountInfo.gender = val;
  }

  educationChange(val: number|string) {
    this.accountInfo.education = val;
  }

  addressChange(val: AppResponse) {
    if (!val.status) {
      this.showMsg = true;
      this.sysMsg = val.msg;
    } else {
      let arr: string[] = val.data.split('#');
      this.accountInfo.address.province_code = arr[0];
      this.accountInfo.address.city_code = arr[1];
      this.accountInfo.address.county_code = arr[2];
      this.accountInfo.address.street_code = arr[3];
    }
  }

  changeHeadPortrait() {

  }

  selectedFileOnChanged() {

  }

  successItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    // 上传文件成功
    if (status == 200) {
      // 上传文件后获取服务器返回的数据
      let tempRes = JSON.parse(response);
      if (tempRes.status) {
        this.accountInfo.head_portrait = tempRes.data;
      } else {
        this.showMsg = true;
        this.sysMsg = '上传失败';
      }
    } else {
      // 上传文件后获取服务器返回的数据错误
      this.showMsg = true;
      this.sysMsg = '上传失败';
    }
  }

}
