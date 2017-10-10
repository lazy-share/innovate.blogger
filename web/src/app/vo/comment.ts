/**
 * Created by lzy on 2017/10/7.
 */
export class Comment {
  public replies: Reply[] = new Array<Reply>();
}

export class Reply {
  public from_name: string;
  public subject_name: string;
  public content: string;
  public create_time: Date;
  public update_time: Date;
  public replies: Reply;
}
