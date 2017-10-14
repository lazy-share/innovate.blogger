import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {BaseComponent} from "../common/BaseComponent";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Article, ArticleType} from "../../vo/article";
import {ArticleService} from "./article.service";
import {Paging, PagingParams} from "../../vo/paging";
/**
 * Created by lzy on 2017/10/12.
 *
 */
@Component({
  templateUrl: './article.component.html'
})
export class ArticleComponent extends BaseComponent implements OnDestroy, AfterViewInit, OnInit {

  private requestUsername: string;
  private globalTypeId: string;
  private tinymceElementId: string = "tinymceElementId";
  private isShowPublish: boolean = false;
  private articles: Article[] = new Array<Article>();
  private paging: Paging = Paging.instantiation();
  private pagingParams: PagingParams = PagingParams.instantiation();
  private articleContent: string = "";
  private globalArticleTitle:string = "";
  private articleTypes: ArticleType[] = new Array<ArticleType>();
  private sysDefaultTypes: ArticleType[] = new Array<ArticleType>();
  private definedTypes: ArticleType[] = new Array<ArticleType>();
  private head_portrait: string;

  constructor(private authorizationService: AuthorizationService,
              private articleService: ArticleService,
              private route: ActivatedRoute) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get('username')).subscribe();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
  }

  ngOnInit(): void {
    this.pagingParams.limit = 10;
    this.route.data.subscribe((data: { articles: any }) => {
      if (!data.articles.status) {
        this.showMsg = true;
        this.sysMsg = data.articles.msg;
        return;
      }
      this.initData(data.articles.data);
    });
  }

  /**
   * 初始化数据
   * @param data
   */
  initData(data: any) {
    this.showMsg = false;
    this.articles = data.articles;
    this.articleTypes = data.articleType;
    this.paging.bigTotalItems = data.count;
    this.head_portrait = data.head_portrait;
    this.classfiyArticleType();
  }

  /**
   * 将文章类型按系统默认/自定义两种类型进行分类
   */
  classfiyArticleType() {
    this.sysDefaultTypes = new Array<ArticleType>();
    this.definedTypes = new Array<ArticleType>();
    let current = this.authorizationService.getCurrentUser().username;
    for (let i in this.articleTypes) {
      if (this.articleTypes[i].username == current) {
        this.definedTypes.push(this.articleTypes[i]);
      } else {
        this.sysDefaultTypes.push(this.articleTypes[i]);
      }
    }
  }

  /**
   * 选择文章类型
   * @param type_id
   */
  onSelectType(type_id: string) {
    this.globalTypeId = type_id;
  }

  /**
   * 删除文章类型
   * @param type_id
   */
  onDeleteType(type_id: string) {
    this.articleService.deleteArticleType(type_id).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(()=> {
            this.showMsg = false
          }, 3000);
          return;
        }
        this.showMsg = false;
        this.articleTypes = data.data;
        this.classfiyArticleType();
        this.showSuccess = true;
        this.successMsg = '删除成功';
        setTimeout(()=> {
          this.showSuccess = false
        }, 1000);
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  /**
   * 创建文章类型
   * @param article
   */
  onCreateType(article: ArticleType) {
    article.username = this.authorizationService.getCurrentUser().username;
    this.articleService.createArticleType(article).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(()=> {
            this.showMsg = false
          }, 3000);
          return;
        }
        this.showMsg = false;
        this.articleTypes = data.data;
        this.classfiyArticleType();
        this.showSuccess = true;
        this.successMsg = '创建成功';
        setTimeout(()=> {
          this.showSuccess = false
        }, 1000);
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

  onDrafts() {

  }

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
  onEditorContentChange(content: string) {
    this.articleContent = content;
    this.isShowPublish = this.articleContent != null && this.articleContent != '';
  }

  /**
   * 保存文章
   */
  submitArticle() {
    if (!this.globalTypeId) {
      this.showMsg = true;
      this.sysMsg = '请选择文章类型';
      setTimeout(() => {this.showMsg = false}, 2000);
      return;
    }
    if (!this.globalArticleTitle) {
      this.showMsg = true;
      this.sysMsg = '请输入文章标题';
      setTimeout(() => {this.showMsg = false}, 2000);
      return;
    }
    let article = new Article();
    article.content = this.articleContent;
    article.username = this.authorizationService.getCurrentUser().username;
    article.type = this.globalTypeId;
    article.title = this.globalArticleTitle;
    this.articleService.submitArticle(article, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(() => {this.showMsg = false}, 3000);
          return;
        }
        this.isShow = false;
        this.articles = data.data.articles;
        this.paging.bigTotalItems = data.data.count;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
        setTimeout(() => {this.showMsg = false}, 3000);
      }
    );
  }

  /**
   * 保存到草稿箱
   */
  saveDrafts() {
    alert(this.articleTypes);
  }

}
