import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {BaseComponent} from "../common/BaseComponent";
import {AttentionService} from "./attention.service";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Attention} from "../../vo/attention";
/**
 * Created by lzy on 2017/10/2.
 */

@Component({
  templateUrl: './attention.component.html',
  styleUrls: [
    './attention.component.css'
  ]
})
export class AttentionComponent extends BaseComponent{

  private requestUsername:string;
  private attentions: string[] = new Array<string>();

  constructor(
    private attentionService: AttentionService,
    private route: ActivatedRoute,
    private authorizationService:AuthorizationService,
  ){
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
    this.initAttention();
  }

  initAttention(){
    this.attentionService.attentions(this.requestUsername).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.attentions = data.data;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

}
