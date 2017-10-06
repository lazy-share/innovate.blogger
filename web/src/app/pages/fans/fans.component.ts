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
  private fans: Attention[] = new Array<Attention>();
  private headPortraits: Attention[] = new Array<Attention>();
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
        this.handleResult(data);
        this.initComponent();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  handleResult(data: any){
    this.fans = data.data.fans;
    this.headPortraits = data.data.headPortraits;
    for (let i in this.headPortraits){
      for (let j in this.fans){
        if (this.headPortraits[i].username === this.fans[j].from){
          this.fans[j].head_portrait = this.headPortraits[i].head_portrait;
          break;
        }
      }
    }
  }

  initComponent() {
    let flag = true;
    for (let fan in this.fans) {
      if (this.fans[fan].from == this.authorizationService.getCurrentUser().username) {
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
        this.handleResult(data);
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
        this.handleResult(data);
        this.initComponent();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }
}
