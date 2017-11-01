import {OnInit, TemplateRef, ViewChild} from "@angular/core";
import {BaseComponent} from "../common/BaseComponent";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {ParamMap, Router, ActivatedRoute} from "@angular/router";
import {AppResponse} from "../../vo/app-response";
import {Relation} from "../../vo/relation";
import {MY_RELATIONS, MY_RELATION, MY_RELATION_CLEAR} from "../../constant/uri";
import {Component} from "@angular/core";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {AppModal} from "../../vo/app-modal";
/**
 * Created by lzy on 2017/10/29.
 */

@Component({
  templateUrl: './relation.component.html'
})
export class RelationComponent extends BaseComponent implements OnInit {

  public requestAccountId: string;
  public relations:Relation[] = new Array<Relation>();
  @ViewChild('appModalTemplate')
  public appModalTemplateDiv:TemplateRef<any>;
  public appModal:AppModal = new AppModal('确定删除', '确定删除吗?', 'confirmDelNoteModal', false);
  public modalRef: BsModalRef;

  constructor(
    public http:HttpClient,
    public authorizationService: AuthorizationService,
    public router: Router,
    public route: ActivatedRoute,
    public modalService: BsModalService,
  ){
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestAccountId = params.get("account_id")).subscribe();
  }

  ngOnInit(): void {
    this.http.get<AppResponse>(
      MY_RELATIONS,
      {
        params: new HttpParams().set('account_id', this.requestAccountId)
      }
    ).subscribe(
      data => {
        if (data.status){
          this.relations = data.data;
        }
      }
    );
  }

  clear(){
    this.appModal.content = "确定清空所有记录吗?";
    this.modalRef = this.modalService.show(this.appModalTemplateDiv);
  }

  /**
   * 取消模态框
   */
  cancleModal(){
    this.modalRef.hide();
  }
  excuteDel(){
    this.http.delete<AppResponse>(
      MY_RELATION_CLEAR,
      {
        params: new HttpParams().set('account_id',  this.authorizationService.getCurrentUser()._id)
      }
    ).subscribe(
      data => {
        if (data.status){
          this.authorizationService.setRelationCount(0);
          this.relations = [];
          this.modalRef.hide();
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
