import {Component, OnInit, ViewChild, OnDestroy} from "@angular/core";
import {BaseComponent} from "../common/BaseComponent";
import {Account} from "../../vo/account";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {InfoService} from "./info.service";
import {environment} from "../../../environments/environment";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {AppResponse} from "../../vo/app-response";
import {FileUploader, FileItem, ParsedResponseHeaders} from "ng2-file-upload";
import {ACCOUNT_INFO_HEADER} from "../../constant/uri";
import {SelectAddressComponent} from "../../shared/form-component/select-address/select-address.component";
import {IMyDpOptions} from "mydatepicker";
import {MyDatePicker} from "../../vo/my-date-picker";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@Component({
  templateUrl: './info.component.html',
  styleUrls: [
    './info.component.css'
  ]
})
export class InfoComponent extends BaseComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.uploader.destroy();
  }

  private requestUsername: string = "";
  private storageUsername: string = "";
  private accountInfo: Account = Account.instantiation();
  @ViewChild(SelectAddressComponent)
  private selectAddressComponentChild: SelectAddressComponent;
  private minDate = new Date(1900, 1, 1);
  private maxDate = new Date(2050, 1, 1);
  private uploader: FileUploader = new FileUploader({});
  private birthdayDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    showTodayBtn: false,
    sunHighlight: true,
    editableDateField: false,
    minYear: 1900,
    markCurrentYear: false,
    firstDayOfWeek: 'mo',
    inline: false,
    openSelectorOnInputClick: true,
    maxYear: new Date().getFullYear() - 1
  };
  private birthdayPlusInitDate = {date: {year: 1993, month: 1, day: 1}};
  private birthdayPlusLocale = 'zh-cn';

  constructor(private authorizationService: AuthorizationService,
              private route: ActivatedRoute,
              private infoService: InfoService) {
    super();
  }

  ngOnInit(): void {
    this.initField();
    this.initUploadFileConfig();
    this.route.data
      .subscribe((data: { accountInfo: Account }) => {
        this.accountInfo = data.accountInfo;
        this.initAccountInfo();
        this.selectAddressComponentChild.loadAllProvinces();
      });
    this.addVisitor();
  }


  addVisitor(){
    if (this.requestUsername != this.authorizationService.getCurrentUser().username) {
      this.infoService.addVisitor(this.requestUsername, this.authorizationService.getCurrentUser().username).subscribe(
        data => {
          //todo 处理添加访客成功
        },
        err => {
          //todo 处理添加访客失败
        }
      );
    }
  }

  initField(){
    this.storageUsername = this.authorizationService.getCurrentUser() && this.authorizationService.getCurrentUser().username;
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
  }

  initUploadFileConfig(){
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
    if (!this.accountInfo.birthday || !this.accountInfo.birthday.date || this.accountInfo.birthday.date.year == 0 ||
      this.accountInfo.birthday.date.month == 0 || this.accountInfo.birthday.date.day == 0){
      this.accountInfo.birthday = new MyDatePicker();
    }
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
