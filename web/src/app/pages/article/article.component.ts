import {Component} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {BaseComponent} from "../common/BaseComponent";
/**
 * Created by lzy on 2017/10/12.
 */
@Component({
  templateUrl: './article.component.html'
})
export class ArticleComponent extends BaseComponent{

  constructor(
    private authorizationService:AuthorizationService
  ){
    super();
  }

  /**
   * 取消/写文章
   */
  changeBtn() {
    if (this.isShow) {

    }
    this.isShow = !this.isShow;
  }
}
