import {environment} from "../../environments/environment";
/**
 * Created by lzy on 2017/9/26.
 */
export class Address {
  province_code: string;
  province_name: string;
  city_code: string;
  city_name: string;
  county_code: string;
  county_name: string;
  street_code: string;
  street_name: string;
  details: string;
  static instantiation () {
    let address: Address = new Address();
    address.province_code = "";
    address.province_name = "";
    address.city_code = "";
    address.city_name = "";
    address.county_code = "";
    address.county_name = "";
    address.street_code = "";
    address.street_name = "";
    address.details = "";
    return address;
  }
}
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
  public birthday: Date;
  public qq:string;
  public wechat:string;
  public motto:string;
  public address:Address;

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
    return account;
  }
}
