/**
 * Created by lzy on 2017/10/12.
 */
export class Article {
  public content:string;
  public username:string;
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

  static instantiation() {
    let article = new Article();
    article.content = "";
    article.type = '';
    article.username = '';
    article.title = '';
    article.isPrivate = false;
    article.desc = '';
    article.praise =  new Array<string>();
    article.comment = '';
    article.isManuscript = false;
    return article;
  }
}

export class ArticleType {
  public username:string;
  public _id:string;
  public name:string;
}
