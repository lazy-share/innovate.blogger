import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Doc} from "../../vo/doc";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Estimate} from "../../vo/estimate";
import {Reply} from "../../vo/comment";
/**
 * Created by laizhiyuan on 2017/10/13.
 */
@Component({
  selector: 'estimate',
  templateUrl: './estimate.component.html'
})
export class EstimateComponent {
  @Input()
  private doc: Doc = Doc.instantiation();
  @Output()
  private onComment = new EventEmitter<Estimate>();
  @Output()
  private onPraise = new EventEmitter<string>();
  @Output()
  private onReply = new EventEmitter<Reply>();
  @Output()
  private onDeleteDocBefore = new EventEmitter<string>();
  @Output()
  private onDeleteCommentBefore = new EventEmitter<Reply>();

  constructor(
    private authorizationService:AuthorizationService
  ){}

  comment(doc_id:string, parent_id:string, subject: string){
      let estimate = new Estimate();
      estimate.parent_id = parent_id;
      estimate.subject = subject;
      estimate.doc_id = doc_id;
      this.onComment.emit(estimate);
  }

  praise(doc_id:string){
    this.onPraise.emit(doc_id);
  }

  deleteDocBefore(doc_id:string){
    this.onDeleteDocBefore.emit(doc_id);
  }

  deleteCommentBefore(doc_id:string, reply_id:string){
    let reply = new Reply();
    reply.doc_id = doc_id;
    reply.id = reply_id;
    this.onDeleteCommentBefore.emit(reply);
  }

  reply(doc_id:string, reply:Reply){
    reply.doc_id = doc_id;
    this.onReply.emit(reply);
  }
}
