import {Injectable} from "@angular/core";
import {AppResponse} from "../../vo/app-response";
import {Observable} from "rxjs/Observable";
import {Article} from "../../vo/article";
import {HttpClient} from "@angular/common/http";
import {MY_ARTICLE} from "../../constant/uri";
import {PagingParams} from "../../vo/paging";
/**
 * Created by lzy on 2017/10/12.
 */
@Injectable()
export class ArticleService {

  constructor(
    private http:HttpClient
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
}
