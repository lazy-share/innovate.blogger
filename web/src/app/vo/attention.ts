/**
 * Created by lzy on 2017/10/2.
 */
export class RelationShip{
  from: string;
  subject: string;
  update_time: Date;
  account_id: string;
  head_portrait: string;


  static instantiation(){
    let vo: RelationShip = new RelationShip();
    vo.from = "";
    vo.subject = "";
  }
}
