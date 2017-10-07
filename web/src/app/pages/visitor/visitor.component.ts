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

  private requestUsername:string;
  private visitors: RelationShip[] = new Array<RelationShip>();
  private headPortraits:RelationShip[] = new Array<RelationShip>();

  constructor(
    private route:ActivatedRoute,
    private visitorService:VisitorService,
    private authorizationService: AuthorizationService
  ){
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
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
    this.visitors = data.data.visitors;
    this.headPortraits = data.data.headPortraits;
    for (let i in this.headPortraits){
      for (let j in this.visitors){
        if (this.headPortraits[i].username === this.visitors[j].from){
          this.visitors[j].head_portrait = this.headPortraits[i].head_portrait;
          break;
        }
      }
    }
  }

}
