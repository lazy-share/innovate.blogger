import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Reply} from "../../vo/comment";
import {AuthorizationService} from "../../core/authorization/authorization.service";
/**
 * Created by laizhiyuan on 2017/10/11.
 */

export class EmitReply {
  subject:string;
  root_reply:string;
}
@Component({
  selector: 'reply',
  templateUrl: './reply.component.html'
})
export class ReplyComponent {

  @Input()
  private replies:Reply[];
  @Output()
  private onReply = new EventEmitter<Reply>();
  @Output()
  private onRemoveReply = new EventEmitter<string>();

  constructor(private authorizationService: AuthorizationService){

  }

  reply(subject:string, parent_id:string){
    let reply = new Reply();
    reply.parent_id = parent_id;
    reply.subject_name = subject;
    this.onReply.emit(reply);
  }

  removeReply(replyId:string){
    this.onRemoveReply.emit(replyId);
  }
}
