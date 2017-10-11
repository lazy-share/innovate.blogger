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
    this.onReply.emit(reply);
  }

  removeReply(replyId:string, ele:any){
    this.onRemoveReply.emit(replyId);
  }
}
