import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {BaseComponent} from "../common/BaseComponent";
import {AttentionService} from "./attention.service";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {RelationShip} from "../../vo/attention";
/**
 * Created by lzy on 2017/10/2.
 */

@Component({
  templateUrl: './attention.component.html',
  styleUrls: [
    './attention.component.css'
  ]
})
export class AttentionComponent extends BaseComponent {

  private requestUsername: string;
  private attentions: RelationShip[] = new Array<RelationShip>();
  private headPortraits: RelationShip[] = new Array<RelationShip>();

  constructor(private attentionService: AttentionService,
              private route: ActivatedRoute,
              private authorizationService: AuthorizationService,) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
    this.initAttention();
  }

  initAttention() {
    this.route.data.subscribe((rlt: {obj: any}) => {
        if (!rlt.obj.status) {
          this.showMsg = true;
          this.sysMsg = rlt.obj.msg;
          return;
        }
        this.attentions = rlt.obj.data.attentions;
        this.headPortraits = rlt.obj.data.headPortraits;
        for (let i in this.headPortraits) {
          for (let j in this.attentions) {
            if (this.headPortraits[i].username === this.attentions[j].subject) {
              this.attentions[j].head_portrait = this.headPortraits[i].head_portrait;
              break;
            }
          }
        }
      });
  }

}
