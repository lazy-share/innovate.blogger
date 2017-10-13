import {AfterViewInit, Component, OnDestroy} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {BaseComponent} from "../common/BaseComponent";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Article} from "../../vo/article";
import {ArticleService} from "./article.service";
import {Paging, PagingParams} from "../../vo/paging";
/**
 * Created by lzy on 2017/10/12.
 *
 */
@Component({
  templateUrl: './article.component.html'
})
export class ArticleComponent extends BaseComponent implements OnDestroy, AfterViewInit{

  private requestUsername:string;
  private globalArticle = Article.instantiation();
  private tinymceElementId:string = "tinymceElementId";
  private isDisabledPublish:boolean = true;
  private articles: Article[] = new Array<Article>();
  private paging:Paging = Paging.instantiation();
  private pagingParams:PagingParams = PagingParams.instantiation();
  private articleContent:string = "";

  constructor(
    private authorizationService:AuthorizationService,
    private articleService:ArticleService,
    private route:ActivatedRoute
  ){
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get('username')).subscribe();
  }

  ngAfterViewInit(): void {}
  ngOnDestroy() {}
  /**
   * 取消/写文章
   */
  changeBtn() {
    if (this.isShow) {
    }
    this.isShow = !this.isShow;
  }

  /**
   * 每次改变文章内容时调用
   * @param content
   */
  onEditorContentChange(content:string){
    this.articleContent = content;
    this.isDisabledPublish = this.articleContent == null || this.articleContent == '';
  }

  /**
   * 保存文章
   */
  submitArticle(){
    let article = new Article();
    article.content = this.articleContent;
    article.username = this.authorizationService.getCurrentUser().username;
    this.articleService.submitArticle(this.globalArticle, this.pagingParams).subscribe(
      data => {
        if (!data.status){
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.isShow = false;
        this.articles = data.data.articles;
        this.paging.bigTotalItems = data.data.count;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

}
