/**
 * Created by lzy on 2017/10/7.
 */
export class Comment {
  public replies: Reply[] = new Array<Reply>();
}

export class Reply {
  public id:string;
  public _id:string;
  public from: any;
  public subject: any;
  public content: string;
  public create_time: Date;
  public update_time: Date;
  public replies: Reply[] = new Array<Reply>();
  public root_id:string;
  public parent_id:string;
  public doc_id:string;
  public account_id:string;

  constructor(){}

  static toNew(reply: Reply){
    let newReply = new Reply();
    newReply.id = reply.id;
    newReply._id = reply._id;
    newReply.from = reply.from;
    newReply.subject = reply.subject;
    newReply.content = reply.content;
    newReply.create_time = reply.create_time;
    newReply.update_time = reply.update_time;
    newReply.root_id = reply.root_id;
    newReply.parent_id = reply.parent_id;
    newReply.doc_id = reply.doc_id;
    newReply.account_id = reply.account_id;
    newReply.replies = reply.replies;
    return newReply;
  }
}
