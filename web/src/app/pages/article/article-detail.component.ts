import {Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {ArticleService} from "./article.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {BaseComponent} from "../common/BaseComponent";
import {Article} from "../../vo/article";
import {Reply} from "../../vo/comment";
import {AppModal} from "../../vo/app-modal";
/**
 * Created by lzy on 2017/10/15.
 */
@Component({
  templateUrl: './article-detail.component.html'
})
export class ArticleDetailComponent extends BaseComponent implements OnInit{

  public requestUsername: string;
  public globalReplyId:string;
  public article:Article = Article.instantiation();
  public commentContent:string = '';
  public initCommentMaxLength = 50;
  public commentMaxLength = 50;
  public replys:string[] = new Array<string>();
  public hideSubmitComment = true;
  public nativeElement = this.elementRef.nativeElement;
  public globalReply:Reply;
  public appModal:AppModal = new AppModal('确定删除', '确定删除吗？', 'confirmDelNoteModal', false);
  public modalRef: BsModalRef;
  @ViewChild('appModalTemplate')
  public appModalTemplateDiv:TemplateRef<any>;

  constructor(public authorizationService: AuthorizationService,
              public articleService: ArticleService,
              public modalService: BsModalService,
              public elementRef:ElementRef,
              public renderer2:Renderer2,
              public route: ActivatedRoute) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get('username')).subscribe();
    this.route.paramMap.switchMap((params: ParamMap) => this.globalReplyId = params.get('id')).subscribe();
  }

  ngOnInit(): void {
    this.articleService.detail(this.globalReplyId, this.requestUsername, this.authorizationService.getCurrentUser().username).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(()=> {
            this.showMsg = false
          }, 3000);
          return;
        }
        this.article = data.data.article;
        this.replys = data.data.comment.replies;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
        setTimeout(()=> {
          this.showMsg = false
        }, 3000);
      }
    );
  }

  /**
   * 赞
   * @param id
   */
  praise(id:string){
    let currentUsername = this.authorizationService.getCurrentUser().username;
    this.articleService.praise(id, currentUsername).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(()=> {
            this.showMsg = false
          }, 3000);
          return;
        }
        this.article = data.data;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
        setTimeout(()=> {
          this.showMsg = false
        }, 3000);
      }
    );
  }

  /**
   * 监听评论输入事件
   */
  keyupComment(){
    if (this.commentContent){
      this.hideSubmitComment = false;
      this.commentMaxLength = this.initCommentMaxLength - this.commentContent.length;
    }else {
      this.hideSubmitComment = true;
      this.commentMaxLength = this.initCommentMaxLength;
    }
  }

  /**
   * 评论
   * @param parentId
   * @param subject
   */
  onComment(reply: Reply){
    reply.id = this.article.comment;
    reply.from_name = this.authorizationService.getCurrentUser().username;
    this.globalReply = reply;
    this.commentContent = '';
    this.commentMaxLength = this.initCommentMaxLength;
    this.hideSubmitComment = true;
    this.openCommentInput(reply.parent_id, reply.subject_name);
  }
  comment(parent_id:string, subject:string){
    let reply = new Reply();
    reply.parent_id = parent_id;
    reply.subject_name = subject;
    this.onComment(reply);
  }

  /**
   * 打开评论输入框
   * @param parent_id
   * @param subject
   */
  openCommentInput(parent_id:string, subject: string){
    let commentDiv = this.nativeElement.querySelector('#commentDivEle'); //评论 div
    this.renderer2.setProperty(commentDiv, 'hidden', false);
    let commentInput = this.nativeElement.querySelector('#commentInputEle'); //评论 input
    if (!parent_id){ //顶级评论发起者
      this.renderer2.setProperty(commentInput, 'placeholder', '评论' + this.requestUsername);
    }else { //子回复
      this.renderer2.setProperty(commentInput, 'placeholder', '回复' + subject);
    }
    commentInput.focus();
  }

  /**
   * 提交评论
   */
  submitComment(){
    this.globalReply.content = this.commentContent;
    this.commentContent = '';
    this.articleService.submitReply(this.globalReply).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(()=> {
            this.showMsg = false
          }, 3000);
          return;
        }
        this.replys = data.data.replies;
        this.cancleCommen();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
        setTimeout(()=> {
          this.showMsg = false
        }, 3000);
      }
    );
  }

  cancleCommen(){
    this.globalReply = new Reply();
    this.commentContent = '';
    this.commentMaxLength = this.initCommentMaxLength;
    let commentDiv = this.nativeElement.querySelector('#commentDivEle');
    this.renderer2.setProperty(commentDiv, 'hidden', true);
  }

  /**
   * 去删除评论
   * @param replyId
   */
  deleteCommentBefore(replyId:string){
    this.globalReply = new Reply();
    this.globalReply.root_id = this.article.comment;
    this.globalReply.id = replyId;
    this.appModal.content = "确定永久删除该评论/回复吗?";
    this.modalRef = this.modalService.show(this.appModalTemplateDiv);
  }

  /**
   * 取消模态框
   */
  cancleModal(){
    this.globalReply = new Reply();
    this.modalRef.hide();
  }

  /**
   * 执行模态框的删除，这里删除评论
   */
  excuteDel(){
    this.articleService.deleteComment(this.globalReply).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(()=> {
            this.showMsg = false
          }, 3000);
          return;
        }
        this.globalReply = new Reply();
        this.replys = data.data.replies;
        this.modalRef.hide();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
        setTimeout(()=> {
          this.showMsg = false
        }, 3000);
      }
    )
  }
}
