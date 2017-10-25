import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {BaseComponent} from "../common/BaseComponent";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Article, ArticleType} from "../../vo/article";
import {ArticleService} from "./article.service";
import {Paging, PagingParams} from "../../vo/paging";
import {ViewChild} from "@angular/core";
import {ArticleNavComponent} from "../../shared/article-nav/article-nav.component";
import {TinymceEditorComponent} from "../../shared/tinymce-editor/tinymce.component";
import {BsModalService, BsModalRef} from "ngx-bootstrap";
import {AppModal} from "../../vo/app-modal";
import {SearchService} from "../../core/search/search.service";
import {Subscription} from "rxjs";
/**
 * Created by lzy on 2017/10/12.
 *
 */
@Component({
  templateUrl: './article.component.html'
})
export class ArticleComponent extends BaseComponent implements OnDestroy, AfterViewInit, OnInit {

  public requestUsername: string;
  public globalTypeId: string;
  public tinymceElementId: string = "tinymceElementId";
  public articles: Article[] = new Array<Article>();
  public paging: Paging = Paging.instantiation();
  public pagingParams: PagingParams = PagingParams.instantiation();
  public globalArticleId:string = '';
  public globalArticleContent: string = "";
  public globalArticleTitle:string = "";
  public globalArticleDesc:string = '';
  public globalArticleIsPrivate:boolean = false;
  public articleTypes: ArticleType[] = new Array<ArticleType>();
  public sysDefaultTypes: ArticleType[] = new Array<ArticleType>();
  public definedTypes: ArticleType[] = new Array<ArticleType>();
  @ViewChild(ArticleNavComponent)
  public articleNavComponent:ArticleNavComponent;
  @ViewChild(TinymceEditorComponent)
  public tinymceComponent:TinymceEditorComponent;
  public appModal:AppModal = new AppModal('确定删除', '确定删除吗？', 'confirmDelNoteModal', false);
  public modalRef: BsModalRef;
  @ViewChild('appModalTemplate')
  public appModalTemplateDiv:TemplateRef<any>;
  public isEdit:boolean = false;
  public isManuscript:boolean = false; //草稿箱/文章
  subscription: Subscription;

  constructor(public authorizationService: AuthorizationService,
              public articleService: ArticleService,
              public modalService: BsModalService,
              public searchService:SearchService,
              public route: ActivatedRoute) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get('username')).subscribe();
    this.subscription = this.searchService.missionAnnounced$.subscribe(
      keyword => {
        this.doSearch(keyword);
      });
    this.searchService.confirmMission(true);
  }

  /**
   * 关键字搜索
   * @param keyword
   */
  doSearch(keyword:string){
    if (this.paging.bigCurrentPage > 1){
      this.paging.bigCurrentPage = 1;
      this.paging.bigTotalItems = -1;
    }
    let pag = PagingParams.instantiation();
    pag.keyword = keyword;
    this.articleService.articles(
      this.requestUsername,
      this.authorizationService.getCurrentUser().username,
      this.isManuscript,
      pag
    ).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.initData(data.data);
      }
    );
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
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
  onSelectType(type_id: string, type_name:string) {
    this.globalTypeId = type_id;
  }

  /**
   * 文章是否不公开
   * @param isPrivate
   */
  onChangeIsPrivate(isPrivate:boolean){
    this.globalArticleIsPrivate = isPrivate;
  }

  /**
   * 取消模态框
   */
  cancleModal(){
    this.globalArticleId = '';
    this.modalRef.hide();
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

  /**
   * 取消/写文章
   */
  changeBtn() {
    if (this.isShow) {
    }
    this.isShow = !this.isShow;
    this.clearTinyMceEdit();
  }

  /**
   * 每次改变文章内容时调用
   * @param content
   */
  onEditorContentChange(content: string) {
    this.globalArticleContent = content;
  }

  /**
   * 查草稿箱列表
   * @param isManuscript
   */
  listForDrafts(isManuscript:boolean) {
    this.paging = Paging.instantiation();
    this.isManuscript = isManuscript;
    this.articleService.articles(
      this.requestUsername,
      this.authorizationService.getCurrentUser().username,
      isManuscript,
      PagingParams.instantiation()
    ).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.initData(data.data);
      }
    );
  }

  /**
   * 保存文章
   */
  submitArticle(isManuscript:boolean) {
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
    if (!this.globalArticleDesc) {
      this.showMsg = true;
      this.sysMsg = '请输入文章描述';
      setTimeout(() => {this.showMsg = false}, 2000);
      return;
    }
    let article = new Article();
    article.content = this.globalArticleContent;
    article.username = this.authorizationService.getCurrentUser().username;
    article.type = this.globalTypeId;
    article.desc = this.globalArticleDesc;
    article.title = this.globalArticleTitle;
    article.isPrivate = this.globalArticleIsPrivate;
    article.isManuscript = isManuscript;
    this.articleService.submitArticle(article, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(() => {this.showMsg = false}, 3000);
          return;
        }
        this.handleSaveOrEditAfterResponse(data);
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
        setTimeout(() => {this.showMsg = false}, 3000);
      }
    );
  }

  /**
   * 去编辑
   * @param articleId
   */
  toEditArticle(articleId: string){
    this.articleService.toEditArticle(articleId).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(() => {this.showMsg = false}, 3000);
          return;
        }
        let article = data.data.article;
        this.globalArticleDesc = article.desc;
        this.globalArticleIsPrivate = article.is_private;
        this.globalTypeId = article.type;
        this.globalArticleId = article._id;
        this.globalArticleContent = article.content;
        this.globalArticleTitle = article.title;
        this.articleNavComponent.changeCurrentShowType(data.data.type_name);
        this.articleNavComponent.setIsPrivate(article.is_private);
        this.tinymceComponent.setContent(article.content);
        this.isShow = true;
        this.isEdit = true;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
        setTimeout(() => {this.showMsg = false}, 3000);
      }
    );
  }

  /**
   * 保存编辑
   */
  confirmEditArticle(isManuscript:boolean){
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
    if (!this.globalArticleDesc) {
      this.showMsg = true;
      this.sysMsg = '请输入文章描述';
      setTimeout(() => {this.showMsg = false}, 2000);
      return;
    }
    let article = new Article();
    article.content = this.globalArticleContent;
    article.username = this.authorizationService.getCurrentUser().username;
    article.type = this.globalTypeId;
    article.desc = this.globalArticleDesc;
    article.title = this.globalArticleTitle;
    article.isPrivate = this.globalArticleIsPrivate;
    article.id = this.globalArticleId;
    article.isManuscript = isManuscript;
    this.articleService.confirmEditArticle(article, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(() => {this.showMsg = false}, 3000);
          return;
        }
        this.handleSaveOrEditAfterResponse(data);
        this.globalArticleId = '';
        this.isEdit = false;
        this.showSuccess = true;
        this.successMsg = '编辑成功';
        setTimeout(() => {this.showSuccess = false}, 1000);
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
        setTimeout(() => {this.showMsg = false}, 3000);
      }
    );
  }

  toDeleteArticle(articleId:string) {
    this.globalArticleId = articleId;
    this.appModal.content = "确定永久删除该文章吗?";
    this.modalRef = this.modalService.show(this.appModalTemplateDiv);
  }

  /**
   * 执行模态框的删除
   */
  excuteDel(){
    this.deleteArticle();
    this.modalRef.hide();
}

  deleteArticle(){
    this.articleService.deleteArticle(this.globalArticleId, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(() => {this.showMsg = false}, 3000);
          return;
        }
        this.showSuccess = true;
        this.successMsg = '删除成功';
        setTimeout(() => {this.showSuccess = false}, 1000);
        this.articles = data.data.articles;
        this.paging.bigTotalItems = data.data.count;
        this.globalArticleId = '';
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
        setTimeout(() => {this.showMsg = false}, 3000);
      }
    );
  }

  /**
   * 新增、编辑后需要还原全局变量默认值
   * @param data
   */
  handleSaveOrEditAfterResponse(data:any){
    this.isShow = false;
    this.articles = data.data.articles;
    if (data.data.count){ //编辑不查这个
      this.paging.bigTotalItems = data.data.count;
    }
    this.clearTinyMceEdit();
  }

  clearTinyMceEdit(){
    this.globalArticleDesc = '';
    this.globalArticleTitle = '';
    this.globalArticleContent = '';
    this.globalArticleId = '';
    this.globalTypeId = '';
    this.articleNavComponent.changeCurrentShowType('选择文章类型');
    this.articleNavComponent.initDefaultData();
    this.tinymceComponent.clearContent();
    this.globalArticleIsPrivate = false;
  }

  /**
   * 实现分页
   * @param event
   */
  public pageChanged(event: any): void {
    if (this.paging.bigTotalItems == -1){
      return;
    }
    this.pagingParams.currentPage = event.page;
    this.pagingParams.pageSize = event.itemsPerPage;
    this.pagingParams.skip = this.pagingParams.getSkip();

    this.articleService.articles(
      this.requestUsername,
      this.authorizationService.getCurrentUser().username,
      this.isManuscript,
      this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.initData(data.data);
      }
    );
  }
}
