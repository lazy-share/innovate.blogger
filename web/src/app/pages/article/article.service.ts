import {Injectable} from "@angular/core";
import {AppResponse} from "../../vo/app-response";
import {Observable} from "rxjs/Observable";
import {Article, ArticleType} from "../../vo/article";
import {HttpClient, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {MY_ARTICLE, MY_ARTICLES, MY_ARTICLE_TYPE} from "../../constant/uri";
import {PagingParams} from "../../vo/paging";
import {Router} from "@angular/router";
/**
 * Created by lzy on 2017/10/12.
 */
@Injectable()
export class ArticleService {

  constructor(
    private http:HttpClient,
    private router:Router
  ){}

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

  articles(username:string, paging: PagingParams):Observable<AppResponse> {
    return this.http.get<AppResponse>(
      MY_ARTICLES,
      {
        params: new HttpParams().set('username', username).set('paging', JSON.stringify(paging))
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
}
