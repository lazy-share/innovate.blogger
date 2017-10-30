import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {VisitorService} from "./visitor.service";
import {RelationShip} from "../../vo/attention";
import {BaseComponent} from "../common/BaseComponent";
import {AuthorizationService} from "../../core/authorization/authorization.service";
/**
 * Created by lzy on 2017/10/6.
 */
@Component({
  templateUrl: './visitor.component.html',
  styleUrls: [
    './visitor.component.css'
  ]
})
export class VisitorComponent extends BaseComponent implements OnInit{

  public requestAccountId:string;
  public visitors: RelationShip[] = new Array<RelationShip>();

  constructor(
    public route:ActivatedRoute,
    public visitorService:VisitorService,
    public authorizationService: AuthorizationService
  ){
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestAccountId = params.get("account_id")).subscribe();
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (rlt: {obj: any}) => {
        if (!rlt.obj.status){
          this.isShow = true;
          this.sysMsg = rlt.obj.msg;
          return;
        }
        this.isShow = false;
        this.handlerResult(rlt.obj);
      }
    );
  }

  handlerResult(data :any) {
    this.visitors = data.data;
  }

}
