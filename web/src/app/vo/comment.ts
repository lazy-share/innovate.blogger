/**
 * Created by lzy on 2017/10/7.
 */
export class Comment {
  public replies: Reply[] = new Array<Reply>();
}

export class Reply {
  public id:string;
  public _id:string;
  public from_name: string;
  public subject_name: string;
  public content: string;
  public create_time: Date;
  public update_time: Date;
  public replies: Reply[] = new Array<Reply>();
  public root_id:string;
  public parent_id:string;
  public doc_id:string;
  public username:string;
}
