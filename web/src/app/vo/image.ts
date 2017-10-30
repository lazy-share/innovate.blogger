/**
 * Created by lzy on 2017/10/28.
 */
import {Comment} from "./comment";
export class Image {
  public _id:string = '';
  public comment:Comment = new Comment();
  public account_id:string;
  public image_url:string;
  public upate_time:Date;
  public create_time:Date;
  public praise:string[] = new Array<string>();
  public visitor:number;
  public interspace_name:string;
  public head_portrait:string;

}
