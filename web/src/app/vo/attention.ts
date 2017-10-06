/**
 * Created by lzy on 2017/10/2.
 */
export class Attention{
  from: string;
  subject: string;

  static instantiation(){
    let attention: Attention = new Attention();
    attention.from = "";
    attention.subject = "";
  }
}
