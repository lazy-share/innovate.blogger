/**
 * Created by lzy on 2017/10/2.
 */
export class RelationShip{
  from: string;
  subject: string;
  update_time: Date;
  username: string;
  head_portrait: string;


  static instantiation(){
    let attention: RelationShip = new RelationShip();
    attention.from = "";
    attention.subject = "";
  }
}
