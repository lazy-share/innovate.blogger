import {Injectable} from "@angular/core";
import {AppResponse} from "../../vo/app-response";
import {Observable} from "rxjs/Observable";
import {Article, ArticleType} from "../../vo/article";
import {HttpClient, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {
  MY_ARTICLE, MY_ARTICLES, MY_ARTICLE_TYPE, MY_ARTICLE_DETAIL, MY_ARTICLE_PRAISE,
  MY_ARTICLE_COMMENT, MY_ARTICLE_CANCLE
} from "../../constant/uri";
import {PagingParams} from "../../vo/paging";
import {Router} from "@angular/router";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Reply} from "../../vo/comment";
/**
 * Created by lzy on 2017/10/12.
 */
@Injectable()
export class ArticleService {

  constructor(
    public http:HttpClient,
    public router:Router,
    public authorizationService:AuthorizationService
  ){}

  /**
   * 取消文章
   * @returns {Observable<R>}
   */
  calcleArticle(account_id:string):Observable<AppResponse>{
      return this.http.delete<AppResponse>(
        MY_ARTICLE_CANCLE,
        {
          params: new HttpParams().set('account_id', account_id)
        }
      ).map(
        data => {
          return data;
        }
      );
  }

  /**
   * 删除评论
   * @param reply
   * @returns {Observable<R>}
   */
  deleteComment(reply: Reply):Observable<AppResponse>{
      return this.http.delete<AppResponse>(
        MY_ARTICLE_COMMENT,
        {
          params: new HttpParams().set('reply', JSON.stringify(reply))
        }
      ).map(
        data => {
          return data;
        }
      );
  }

  /**
   * 提交评论
   * @param reply
   * @returns {Observable<R>}
   */
  submitReply(reply: Reply):Observable<AppResponse>{
      return this.http.post<AppResponse>(
        MY_ARTICLE_COMMENT,
        {reply: reply}
      ).map(
        data => {
          return data;
        }
      );
  }

  /**
   * 赞
   * @param id
   * @param current_account_id
   * @returns {Observable<R>}
   */
  praise(id:string, current_account_id:string):Observable<AppResponse>{
      return this.http.post<AppResponse>(
        MY_ARTICLE_PRAISE,
        {id: id, current_account_id: current_account_id}
      ).map(
        data => {
          return data;
        }
      );
  }

  /**
   * 查看全文
   * @param id
   * @param account_id
   * @param current_account_id
   * @returns {Observable<R>}
   */
  detail(id: string, account_id:string, current_account_id:string):Observable<AppResponse>{
    return this.http.get<AppResponse>(
      MY_ARTICLE_DETAIL,
      {
        params: new HttpParams().set('id', id).set('account_id', account_id).set('current_account_id', current_account_id)
      }
    ).map(
      data => {
        return data;
      }
    );
  }

  /**
   * 保存文章
   * @param article
   * @param paging
   * @returns {Observable<R>}
   */
  submitArticle(article:Article, paging:PagingParams):Observable<AppResponse>{
      return this.http.post(
        MY_ARTICLE,
        {article: article, paging: paging}
      ).map(
        data => {
          return data;
        }
      );
  }

  /**
   * 文章列表
   * @param account_id
   * @param current_account_id
   * @param isManuscript 是否是草稿箱
   * @param paging
   * @returns {Observable<R>}
   */
  articles(account_id:string, current_account_id:string, isManuscript:boolean, paging: PagingParams):Observable<AppResponse> {
    return this.http.get<AppResponse>(
      MY_ARTICLES,
      {
        params: new HttpParams().set('account_id', account_id).set('paging', JSON.stringify(paging)).set('current_account_id', current_account_id).set('isManuscript', JSON.stringify(isManuscript))
      }
    ).map(
      data => {
        return data;
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.router.navigate(['system-error',{msg: err.error.message}]);
        } else {
          this.router.navigate(['system-error',{msg: err.error}],);
        }
      }
    );
  }

  /**
   * 创建type
   * @param articleType
   * @returns {Observable<R>}
   */
  createArticleType(articleType: ArticleType):Observable<AppResponse>{
    return this.http.post<AppResponse>(
      MY_ARTICLE_TYPE,
      {articleType: articleType}
    ).map(
      data => {
        return data;
      }
    );
  }

  /**
   * 删除文章类型
   * @param docId
   * @returns {Observable<R>}
   */
  deleteArticleType(docId:string):Observable<AppResponse>{
    return this.http.delete<AppResponse>(
      MY_ARTICLE_TYPE,
      {
        params: new HttpParams().set('id', docId)
      }
    ).map(
      data =>{
        return data;
      }
    );
  }

  deleteArticle(articleId:string, paging:PagingParams):Observable<AppResponse> {
    return this.http.delete<AppResponse>(
      MY_ARTICLE,
      {
        params: new HttpParams().set('id', articleId).set('paging', JSON.stringify(paging)).set('account_id', this.authorizationService.getCurrentUser()._id)
      }
    ).map(
      data => {
        return data;
      }
    );
  }

  /**
   * 去编辑文章
   * @param id
   * @returns {Observable<R>}
   */
  toEditArticle(id:string):Observable<AppResponse>{
    return this.http.get<AppResponse>(
      MY_ARTICLE,
      {
        params: new HttpParams().set('id', id).set('account_id', this.authorizationService.getCurrentUser()._id)
      }
    ).map(
      data => {
        return data;
      }
    );
  }

  /**
   * 确认编辑
   * @param article
   * @param paging
   * @returns {Observable<R>}
   */
  confirmEditArticle(article:Article, paging: PagingParams):Observable<AppResponse>{
    return this.http.put(
      MY_ARTICLE,
      {article: article, paging: paging, account_id: this.authorizationService.getCurrentUser()._id}
    ).map(
      data => {
        return data;
      }
    );
  }
}
