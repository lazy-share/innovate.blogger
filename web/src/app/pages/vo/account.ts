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

  static instantiation () {
    let account: Account = new Account();
    account.username = "";
    account.password = "";
    account.encrypted = "";
    account.status = 0;
    account.confirmPassword = "";
    account.token = "";
    account.id = "";
    return account;
  }
}
