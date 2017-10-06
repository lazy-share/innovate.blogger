import {Component, AfterViewInit} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {BaseComponent} from "../common/BaseComponent";
import {AttentionService} from "./fans.service";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Attention} from "../../vo/attention";
/**
 * Created by lzy on 2017/10/2.
 */

@Component({
  templateUrl: './fans.component.html',
  styleUrls: [
    './fans.component.css'
  ]
})
export class FansComponent extends BaseComponent implements AfterViewInit{

  ngAfterViewInit(): void {
    this.initFans();
  }

  private requestUsername: string;
  private fans: string[] = new Array<string>();
  private isShowAttention: boolean = true;

  constructor(private attentionService: AttentionService,
              private route: ActivatedRoute,
              private authorizationService: AuthorizationService,) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
  }

  initFans(){
    this.attentionService.fans(this.requestUsername).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.fans = data.data;
        this.initComponent();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  initComponent() {
    let flag = true;
    for (let fan in this.fans) {
      if (this.fans[fan] == this.authorizationService.getCurrentUser().username) {
        flag = false;
        break;
      }
    }
    this.isShowAttention = flag;
  }

  attention() {
    this.attentionService.attention(this.requestUsername, this.authorizationService.getCurrentUser().username).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.fans = data.data;
        this.initComponent();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  cancleAttention() {
    this.attentionService.cancleAttention(this.requestUsername, this.authorizationService.getCurrentUser().username).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.fans = data.data;
        this.initComponent();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }
}
