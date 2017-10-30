import {Comment} from "./comment";
/**
 * Created by lzy on 2017/10/7.
 */
export class Note {
  public account_id:string;
  public requestAccountId:string;
  public currentUser:string;
  public content:string;
  public comment: Comment;
  public create_time:Date;
  public update_time:Date;
  public interspace_name:string;
  public head_portrait:string;
  public id:string;
  public _id:string;
  public praise:string[] = new Array<string>();
}
