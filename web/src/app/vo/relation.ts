/**
 * Created by lzy on 2017/10/29.
 */
export class Relation {
  public _id:string;
  public subject:string;
  public from:string;
  public type:number; //1:关注关系 2:访问关系 3：赞  4：评论  其它预留字段
  public doc_type:number; //1: 文章 2：说说 3：图片
  public doc_id:string;
  public upate_time:Date;
  public create_time:Date;
}
