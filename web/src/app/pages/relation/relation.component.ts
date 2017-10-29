import {OnInit} from "@angular/core";
import {BaseComponent} from "../common/BaseComponent";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {ParamMap, Router, ActivatedRoute} from "@angular/router";
import {AppResponse} from "../../vo/app-response";
import {Relation} from "../../vo/relation";
import {MY_RELATIONS,MY_RELATION} from "../../constant/uri";
import {Component} from "@angular/core";
/**
 * Created by lzy on 2017/10/29.
 */

@Component({
  templateUrl: './relation.component.html'
})
export class RelationComponent extends BaseComponent implements OnInit {

  public requestUsername: string;
  public relations:Relation[] = new Array<Relation>();
  constructor(
    public http:HttpClient,
    public authorizationService: AuthorizationService,
    public router: Router,
    public route: ActivatedRoute
  ){
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
  }


  ngOnInit(): void {
    this.http.get<AppResponse>(
      MY_RELATIONS,
      {
        params: new HttpParams().set('username', this.requestUsername)
      }
    ).subscribe(
      data => {
        if (data.status){
          this.relations = data.data;
        }
      }
    );
  }

  view(id:string, type:string){
    this.http.delete<AppResponse>(
      MY_RELATION,
      {
        params: new HttpParams().set('id', id).set('type',type)
      }
    ).subscribe(
      data => {
      }
    );
  }
}
