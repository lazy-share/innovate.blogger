import {ar} from "ngx-bootstrap/locale";
/**
 * Created by lzy on 2017/10/12.
 */
export class Article {
  public content:string;
  public account_id:string;
  public type:string;
  public title:string;
  public desc:string;
  public isPrivate:boolean;
  public id:string;
  public comment:string;
  public praise:string[] = new Array<string>();
  public isManuscript:boolean = false;
  public is_anuscript:boolean = false;
  public is_manuscript:boolean = false;
  public interspace_name:string;
  public head_portrait:string;

  static instantiation() {
    let article = new Article();
    article.content = "";
    article.type = '';
    article.account_id = '';
    article.title = '';
    article.isPrivate = false;
    article.desc = '';
    article.praise =  new Array<string>();
    article.comment = '';
    article.isManuscript = false;
    article.interspace_name = "";
    article.head_portrait = "";
    return article;
  }
}

export class ArticleType {
  public account_id:string;
  public _id:string;
  public name:string;
}
