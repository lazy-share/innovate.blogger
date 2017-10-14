/**
 * Created by lzy on 2017/10/12.
 */
export class Article {
  public content:string;
  public username:string;
  public type:string;
  public title:string;

  static instantiation() {
    let article = new Article();
    article.content = "";
    article.type = '';
    article.username = '';
    article.title = '';
    return article;
  }
}

export class ArticleType {
  public username:string;
  public _id:string;
  public name:string;
}
