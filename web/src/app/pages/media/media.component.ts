import {Component} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {ParamMap, ActivatedRoute} from "@angular/router";
import {Paging} from "../../vo/paging";
import {BaseComponent} from "../common/BaseComponent";
/**
 * Created by lzy on 2017/10/18.
 */
@Component({
  templateUrl: './media.component.html'
})
export class MediaComponent extends BaseComponent{

  private requestUsername: string;
  private paging: Paging = Paging.instantiation();

  constructor(
    private authorizationService: AuthorizationService,
    private route: ActivatedRoute
  ){
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
  }

  changeBtn() {
    this.isShow = !this.isShow;
  }
}
