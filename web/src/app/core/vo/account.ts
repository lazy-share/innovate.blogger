/**
 * Created by lzy on 2017/9/26.
 */
export class Account {
  constructor(
    public id: String,
    public username: String,
    public password: String,
    public status: Number,
    public encrypted: String,
    public token: String
  ){}
}
