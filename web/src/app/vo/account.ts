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
    let account: Account = new Account();
    account.username = "";
    account.password = "";
    account.encrypted = "";
    account.status = 0;
    account.confirmPassword = "";
    account.token = "";
    account.id = "";
    account.head_portrait = "";
    account.gender = "";
    account.education = "";
    account.job = "";
    account.email = "";
    account.mobile = "";
    account.qq = "";
    account.wechat = "";
    account.motto = "";
    account.address = Address.instantiation();
    account.attention = new Array<RelationShip>();
    account.fans = new Array<RelationShip>();
    return account;
  }
}
