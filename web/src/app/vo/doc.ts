/**
 * Created by laizhiyuan on 2017/10/13.
 */
export class Doc {
  public _id:string;
  public visitor:string;
  public praise:string[] = new Array<string>();
  public account_id:string;
  public comment:any;

  static instantiation () {
    let doc = new Doc();

    return doc;
  }
}
