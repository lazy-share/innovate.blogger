import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {BaseComponent} from "../common/BaseComponent";
import {FansService} from "./fans.service";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {RelationShip} from "../../vo/attention";
/**
 * Created by lzy on 2017/10/2.
 */
@Component({
  templateUrl: './fans.component.html',
  styleUrls: [
    './fans.component.css'
  ]
})
export class FansComponent extends BaseComponent implements OnInit{
  ngOnInit(): void {
    this.initFans();
  }

  public requestAccountId: string;
  public fans: RelationShip[] = new Array<RelationShip>();
  public isShowAttention: boolean = true;

  constructor(public attentionService: FansService,
              public route: ActivatedRoute,
              public authorizationService: AuthorizationService,) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestAccountId = params.get("account_id")).subscribe();
  }

  initFans(){
    this.route.data.subscribe((rlt: {obj: any}) => {
      if (!rlt.obj.status) {
        this.showMsg = true;
        this.sysMsg = rlt.obj.msg;
        return;
      }
      this.handleResult(rlt.obj);
      this.initComponent();
    });
  }

  handleResult(data: any){
    this.fans = data.data;
  }

  initComponent() {
    let flag = true;
    for (let fan in this.fans) {
      if (this.fans[fan].from._id == this.authorizationService.getCurrentUser()._id) {
        flag = false;
        break;
      }
    }
    this.isShowAttention = flag;
  }

  attention() {
    this.attentionService.attention(this.requestAccountId, this.authorizationService.getCurrentUser()._id).subscribe(
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
    this.attentionService.cancleAttention(this.requestAccountId, this.authorizationService.getCurrentUser()._id).subscribe(
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
