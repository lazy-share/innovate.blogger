import {Injectable} from "@angular/core";
import {AppResponse} from "../../vo/app-response";
import {Observable} from "rxjs/Observable";
import {Article, ArticleType} from "../../vo/article";
import {HttpClient, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {MY_ARTICLE, MY_ARTICLES, MY_ARTICLE_TYPE, MY_ARTICLE_DETAIL} from "../../constant/uri";
import {PagingParams} from "../../vo/paging";
import {Router} from "@angular/router";
import {AuthorizationService} from "../../core/authorization/authorization.service";
/**
 * Created by lzy on 2017/10/12.
 */
@Injectable()
export class ArticleService {

  constructor(
    private http:HttpClient,
    private router:Router,
    private authorizationService:AuthorizationService
  ){}

  detail(id: string, username:string, currentUsername:string):Observable<AppResponse>{
    return this.http.get<AppResponse>(
      MY_ARTICLE_DETAIL,
      {
        params: new HttpParams().set('id', id).set('username', username).set('currentUsername', currentUsername)
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
   * @param username
   * @param currentUsername
   * @param paging
   * @returns {Observable<R>}
   */
  articles(username:string, currentUsername:string, paging: PagingParams):Observable<AppResponse> {
    return this.http.get<AppResponse>(
      MY_ARTICLES,
      {
        params: new HttpParams().set('username', username).set('paging', JSON.stringify(paging)).set('currentUsername', currentUsername)
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
        params: new HttpParams().set('id', articleId).set('paging', JSON.stringify(paging)).set('username', this.authorizationService.getCurrentUser().username)
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
        params: new HttpParams().set('id', id).set('username', this.authorizationService.getCurrentUser().username)
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
      {article: article, paging: paging, username: this.authorizationService.getCurrentUser().username}
    ).map(
      data => {
        return data;
      }
    );
  }
}
