/**
 * Created by lzy on 2017/10/12.
 */
export class Article {
  public content:string;
  public username:string;
  public type:string;

  static instantiation() {
    let article = new Article();
    article.content = "";
    return article;
  }
}
