import {Comment} from "./comment";
/**
 * Created by lzy on 2017/10/7.
 */
export class Note {
  public username:string;
  public requestUsername:string;
  public currentUsername:string;
  public content:string;
  public comment: Comment;
  public create_time:Date;
  public update_time:Date;
  public id:string;
  public _id:string;
  public praise:string[] = new Array<string>();
}
