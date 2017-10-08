import {RelationShip} from "./attention";
import {Address} from "./address";
import {MyDatePicker} from "./my-date-picker";
/**
 * Created by lzy on 2017/9/26.
 */
export class Account {
  public id: string;
  public username: string;
  public password: string;
  public confirmPassword: string;
  public status: number;
  public encrypted: string;
  public token: string;
  public head_portrait: string;
  public gender: string|number;
  public education: string|number;
  public job:string;
  public email:string;
  public mobile:string;
  public birthday: MyDatePicker;
  public qq:string;
  public wechat:string;
  public motto:string;
  public address:Address;
  public attention:RelationShip[];
  public fans: RelationShip[];
  public last_login_time: Date;

  static instantiation () {
    let vo: Account = new Account();
    vo.username = "";
    vo.password = "";
    vo.encrypted = "";
    vo.status = 0;
    vo.confirmPassword = "";
    vo.token = "";
    vo.id = "";
    vo.head_portrait = "";
    vo.gender = "";
    vo.education = "";
    vo.job = "";
    vo.email = "";
    vo.mobile = "";
    vo.qq = "";
    vo.wechat = "";
    vo.motto = "";
    vo.address = Address.instantiation();
    vo.attention = new Array<RelationShip>();
    vo.fans = new Array<RelationShip>();
    return vo;
  }
}
