import {
  AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef,
  ViewChild
} from "@angular/core";
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
import {Estimate} from "../../vo/estimate";
import {SearchService} from "../../core/search/search.service";
import {Subscription} from "rxjs/Subscription";
/**
 * Created by lzy on 2017/10/6.
 */
enum ModalExcuteDeleteType {
  DELETE_NOTE = 1,
  DELETE_COMMENT = 2
}
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
  @ViewChild('appModalTemplate')
  public appModalTemplateDiv:TemplateRef<any>;
  private modalExcuteDeleteType:ModalExcuteDeleteType; //执行删除类型 "1":删除日记   "2":删除评论
  private hideSubmitComment = true;
  private commentMaxLength = 50;
  private initCommentMaxLength = 50;
  private pagingParams = PagingParams.instantiation();
  private subscription: Subscription;

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
              private searchService:SearchService,
              private renderer2:Renderer2
  ) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
    this.subscription = this.searchService.missionAnnounced$.subscribe(
      keyword => {
        this.doSearch(keyword);
      });
  }

  /**
   * 关键字搜索
   * @param keyword
   */
  doSearch(keyword:string){
    let pag = PagingParams.instantiation();
    pag.keyword = keyword;
    this.noteService.notes(this.requestUsername, this.authorizationService.getCurrentUser().username, pag).subscribe(
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
   * 确认删除日记
   */
  private noteId:string;
  onDeleteDocBefore(id:string){
    this.appModal.content = "确定永久删除该日记吗?";
    this.modalExcuteDeleteType = ModalExcuteDeleteType.DELETE_NOTE;
    this.noteId = id;
    this.modalRef = this.modalService.show(this.appModalTemplateDiv);
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
    this.pagingParams.currentPage = event.page;
    this.pagingParams.pageSize = event.itemsPerPage;
    this.pagingParams.skip = this.pagingParams.getSkip();

    this.noteService.notes(this.requestUsername, this.authorizationService.getCurrentUser().username, this.pagingParams).subscribe(
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
    this.noteService.submitNote(note, this.pagingParams).subscribe(
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
   * 取消模态框
   */
  cancleModal(){
    this.noteId = '';
    this.modalRef.hide();
  }

  /**
   * 执行模态框的删除
   */
  excuteDel(){
    if (this.modalExcuteDeleteType == ModalExcuteDeleteType.DELETE_NOTE) {
      this.deleteNote();
    }else if (this.modalExcuteDeleteType == ModalExcuteDeleteType.DELETE_COMMENT) {
      this.delComment();
    }
  }

  /**
   * 确定删除日记
   */
  deleteNote() {
    let note = new Note();
    note.username = this.authorizationService.getCurrentUser().username;
    note.id = this.noteId;
    this.noteService.deleteNote(note, this.pagingParams).subscribe(
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
  onPraise(id: string) {
    let currentUsername = this.authorizationService.getCurrentUser().username;
    this.noteService.praise(this.requestUsername, currentUsername, id, this.pagingParams).subscribe(
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
  onComment(estimate: Estimate){
    this.globalReply = new Reply();
    this.globalReply.doc_id = estimate.doc_id;
    this.globalReply.parent_id = estimate.parent_id;
    this.globalReply.subject_name = estimate.subject;
    this.commentContent = '';
    this.commentMaxLength = this.initCommentMaxLength;
    this.hideSubmitComment = true;
    this.openCommentInput(estimate.doc_id, estimate.parent_id, estimate.subject);
  }

  openCommentInput(templateId:string, parent_id:string, subject: string){
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
    if (!parent_id){ //顶级评论发起者
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
  onReply(reply:Reply){
    this.globalReply = reply;
    this.openCommentInput(reply.doc_id, reply.parent_id, reply.from_name);
  }

  /**
   * 提交评论
   * @param id
   */
  submitComment(id:string){
    this.globalReply.from_name = this.authorizationService.getCurrentUser().username;
    this.globalReply.username = this.requestUsername;
    this.globalReply.content = this.commentContent;
    this.noteService.submitConment(this.globalReply, this.pagingParams).subscribe(
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
   * 去删除评论
   * @param noteId
   * @param root_id
   * @param replyId
   */
  onDeleteCommentBefore(reply: Reply){
    this.appModal.content = "确定永久删除该评论/回复吗?";
    this.modalExcuteDeleteType = ModalExcuteDeleteType.DELETE_COMMENT;
    this.globalReply = new Reply();
    this.globalReply.doc_id = reply.doc_id;
    this.globalReply.id = reply.id;
    this.globalReply.username = this.requestUsername;
    this.modalRef = this.modalService.show(this.appModalTemplateDiv);
  }

  /**
   * 删除评论
   * @param reply
   * @param id
   * @param root_id
   */
  delComment(){
    this.noteService.delConment(this.globalReply, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.notes = data.data;
        this.cancleCommen('');
        this.modalRef.hide();
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
