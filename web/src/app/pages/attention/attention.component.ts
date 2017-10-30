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

  public requestAccountId: string;
  public attentions: RelationShip[] = new Array<RelationShip>();

  constructor(public attentionService: AttentionService,
              public route: ActivatedRoute,
              public authorizationService: AuthorizationService,) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestAccountId = params.get("account_id")).subscribe();
    this.initAttention();
  }

  initAttention() {
    this.route.data.subscribe((rlt: {obj: any}) => {
        if (!rlt.obj.status) {
          this.showMsg = true;
          this.sysMsg = rlt.obj.msg;
          return;
        }
        this.attentions = rlt.obj.data;
      });
  }

}
