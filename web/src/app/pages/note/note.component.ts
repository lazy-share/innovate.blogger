import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef} from "@angular/core";
import {BaseComponent} from "../common/BaseComponent";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Paging, PagingParams} from "../../vo/paging";
import {Note} from "../../vo/note";
import "tinymce";
import "tinymce/themes/modern";
import "tinymce/plugins/table";
import "tinymce/plugins/link";
import {NoteService} from "./note.service";
import {AppModal} from "../../vo/app-modal";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Reply} from "../../vo/comment";
/**
 * Created by lzy on 2017/10/6.
 */
@Component({
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent extends BaseComponent implements OnInit , AfterViewInit, OnDestroy{

  ngAfterViewInit(): void {
    /*this.initPraise();*/
  }

  ngOnDestroy(): void {
    this.renderer2.destroy();
  }

  /**
   * 初始化变量
   */
  private requestUsername: string;
  private paging: Paging = Paging.instantiation();
  private notes: Note[] = new Array<Note>();
  private content: string;
  private contentNumber: number = 200;
  private initContentNumber: number = 200;
  private head_portrait: string;
  private appModal:AppModal = new AppModal('确定删除', '确定删除吗？', 'confirmDelNoteModal', false);
  public modalRef: BsModalRef;
  public nativeElement = this.elementRef.nativeElement;

  /**
   * 构造器
   * @param route
   * @param authorizationService
   * @param noteService
   * @param modalService
   * @param elementRef
   * @param renderer2
   */
  constructor(private route: ActivatedRoute,
              private authorizationService: AuthorizationService,
              private noteService: NoteService,
              private modalService: BsModalService,
              private elementRef:ElementRef,
              private renderer2:Renderer2
  ) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
  }

  /**
   * 构造器初始化后回调
   */
  ngOnInit(): void {
    this.route.data.subscribe((rlt: {notes: any}) => {
      if (!rlt.notes.status) {
        this.showMsg = true;
        this.sysMsg = rlt.notes.msg;
        return;
      }
      this.initNotes(rlt.notes);
    });
  }

  /**
   * 初始化日记
   * @param data
   */
  initNotes(data: any) {
    this.content = '';
    this.notes = data.data.notes;
    this.paging.bigTotalItems = data.data.count;
    this.head_portrait = data.data.head_portrait;
    this.showMsg = false;
    this.isShow = false;
  }

  /**
   * 实现分页
   * @param event
   */
  public pageChanged(event: any): void {
    let pagingParams = PagingParams.instantiation();
    pagingParams.currentPage = event.page;
    pagingParams.pageSize = event.itemsPerPage;
    pagingParams.skip = pagingParams.getSkip();

    this.noteService.notes(this.requestUsername, this.authorizationService.getCurrentUser().username, pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.initNotes(data);
      }
    );
  }

  changeBtn() {
    if (this.isShow) {
      this.content = '';
    }
    this.isShow = !this.isShow;
  }

  /**
   * 监听写日记输入
   */
  keyup() {
    if (this.content) {
      this.contentNumber = this.initContentNumber - this.content.length;
    }else {
      this.contentNumber = this.initContentNumber;
    }
  }

  /**
   * 提交日记
   */
  submitNote() {
    let note = new Note();
    note.username = this.authorizationService.getCurrentUser().username;
    note.content = this.content;
    this.noteService.submitNote(note, PagingParams.instantiation()).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.initNotes(data);
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  /**
   * 确认删除日记
   */
  private noteId:string;
  toDeleteNote(id:string, template: TemplateRef<any>){
    this.noteId = id;
    this.modalRef = this.modalService.show(template);
  }

  cancleModal(){
    this.noteId = '';
    this.modalRef.hide();
  }

  /**
   * 确定删除日记
   */
  deleteNote() {
    let note = new Note();
    note.username = this.authorizationService.getCurrentUser().username;
    note.id = this.noteId;
    this.noteService.deleteNote(note, PagingParams.instantiation()).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.initNotes(data);
        this.modalRef.hide();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  /**
   * 赞
   * @param id
   */
  praise(id: string) {
    let currentUsername = this.authorizationService.getCurrentUser().username;
    this.noteService.praise(this.requestUsername, currentUsername, id).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.notes = data.data;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  private openCommentDiv:string[] = new Array<string>();
  private commentContent:string;
  private globalReply:Reply;

  /**
   * 打开评论输入框
   * @param noteId     日记id
   * @param root_id    根评论id
   * @param parent_id  父回复id
   * @param subject    回复主题
   */
  comment(noteId:string, root_id:string, parent_id:string, subject: string){
    this.globalReply = new Reply();
    this.globalReply.doc_id = noteId;
    this.globalReply.root_id = root_id;
    this.globalReply.parent_id = parent_id;
    this.globalReply.subject_name = subject;
    this.openCommentInput(noteId, root_id, subject);
  }

  openCommentInput(templateId:string, root_id:string, subject: string){
    let isExists = false;
    //查找以及打开评论输入框的
    for (let i = 0; i < this.openCommentDiv.length; i++){
      if (this.openCommentDiv[i] == templateId){
        isExists = true; //如果本次评论输入已经打开过
      }else {
        this.cancleCommen(this.openCommentDiv[i]); //其它的取消评论
      }
    }
    if (!isExists) {
      this.openCommentDiv.push(templateId); //没打开则把它标记为打开
    }
    let commentDiv = this.nativeElement.querySelector('#T' + templateId); //评论 div
    this.renderer2.setProperty(commentDiv, 'hidden', false);
    let commentInput = this.nativeElement.querySelector('.T' + templateId); //评论 input
    if (!root_id){ //顶级评论发起者
      this.renderer2.setProperty(commentInput, 'placeholder', '评论' + this.requestUsername);
    }else { //子回复
      this.renderer2.setProperty(commentInput, 'placeholder', '回复' + subject);
    }
    commentInput.focus();
  }

  /**
   * 监听子回复组件回复事件
   * @param noteId
   * @param reply
   */
  onReply(noteId:string, root_id:string,  reply:Reply){
    reply.doc_id = noteId;
    reply.root_id = root_id;
    reply.parent_id = reply._id;
    this.globalReply = reply;
    this.openCommentInput(noteId, reply.parent_id, reply.from_name);
  }

  /**
   * 提交评论
   * @param id
   */
  submitComment(id:string){
    this.globalReply.from_name = this.authorizationService.getCurrentUser().username;
    this.globalReply.username = this.requestUsername;
    this.globalReply.content = this.commentContent;
    this.noteService.submitConment(this.globalReply).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.notes = data.data;
        this.cancleCommen('');
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  /**
   * 删除评论
   * @param reply
   * @param id
   * @param root_id
   */
  delComment(noteId:string, root_id:string, replyId:string){
    this.globalReply = new Reply();
    this.globalReply.root_id = root_id;
    this.globalReply.doc_id = noteId;
    this.globalReply.id = replyId;
    this.globalReply.username = this.requestUsername;
    this.noteService.delConment(this.globalReply).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.notes = data.data;
        this.cancleCommen('');
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  /**
   * 取消评论
   * @param id
   */
  cancleCommen(id:string){
    if (id) {
      let commentDiv = this.nativeElement.querySelector('#T' + id);
      this.renderer2.setProperty(commentDiv, 'hidden', true);
    }
    this.commentContent = '';
    this.commentMaxLength = this.initCommentMaxLength;
  }


  private hideSubmitComment = true;
  private commentMaxLength = 50;
  private initCommentMaxLength = 50;

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
}
