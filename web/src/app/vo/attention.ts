/**
 * Created by lzy on 2017/10/2.
 */
export class Attention{
  from: string;
  subject: string;
  update_time: Date;
  username: string;
  head_portrait: string;


  static instantiation(){
    let attention: Attention = new Attention();
    attention.from = "";
    attention.subject = "";
  }
}
