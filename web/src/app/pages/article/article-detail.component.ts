import {Component, OnInit} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {ArticleService} from "./article.service";
import {BsModalService} from "ngx-bootstrap";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {BaseComponent} from "../common/BaseComponent";
import {Article} from "../../vo/article";
import {Reply} from "../../vo/comment";
/**
 * Created by lzy on 2017/10/15.
 */
@Component({
  templateUrl: './article-detail.component.html'
})
export class ArticleDetailComponent extends BaseComponent implements OnInit{

  private requestUsername: string;
  private globalArticleId:string;
  private article:Article = Article.instantiation();
  private replys:Reply[] = new Array<Reply>();

  constructor(private authorizationService: AuthorizationService,
              private articleService: ArticleService,
              private modalService: BsModalService,
              private route: ActivatedRoute) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get('username')).subscribe();
    this.route.paramMap.switchMap((params: ParamMap) => this.globalArticleId = params.get('id')).subscribe();
  }

  ngOnInit(): void {
    this.articleService.detail(this.globalArticleId, this.requestUsername, this.authorizationService.getCurrentUser().username).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(()=> {
            this.showMsg = false
          }, 3000);
          return;
        }
        this.article = data.data.article;
        this.replys = data.data.comment.replys;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
        setTimeout(()=> {
          this.showMsg = false
        }, 3000);
      }
    );
  }
}
