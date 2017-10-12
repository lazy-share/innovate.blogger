import {Component, EventEmitter, Input, Output, AfterViewInit} from "@angular/core";
import {Reply} from "../../vo/comment";
import {AuthorizationService} from "../../core/authorization/authorization.service";
/**
 * Created by laizhiyuan on 2017/10/11.
 */
@Component({
  selector: 'reply',
  templateUrl: './reply.component.html'
})
export class ReplyComponent {

  @Input()
  public replies: Array<any> = new Array<any>();
  @Output()
  private onReply = new EventEmitter<Reply>();
  @Output()
  private onRemoveReply = new EventEmitter<string>();

  constructor(private authorizationService: AuthorizationService){
  }

  reply(reply:Reply){
    let newReply = Reply.toNew(reply);
    newReply.parent_id = newReply._id;
    newReply.subject_name = newReply.from_name;
    this.onReply.emit(newReply);
  }

  removeReply(replyId:string){
    this.onRemoveReply.emit(replyId);
  }
}
