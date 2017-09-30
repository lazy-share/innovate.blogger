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
  public birthday:string;

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
    account.birthday = "";
    return account;
  }
}
