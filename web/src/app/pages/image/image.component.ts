import {BaseComponent} from "../common/BaseComponent";
import {OnInit, ElementRef, Renderer2, ViewChild, TemplateRef} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Component} from "@angular/core";
import {Paging, PagingParams} from "../../vo/paging";
import {MY_IMAGE} from "../../constant/uri";
import {environment} from "../../../environments/environment";
import {FileUploader, ParsedResponseHeaders, FileItem} from "ng2-file-upload";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Image} from "../../vo/image";
import {ImageService} from "./image.service";
import {Reply} from "../../vo/comment";
import {Estimate} from "../../vo/estimate";
import {BsModalService, BsModalRef} from "ngx-bootstrap";
import {AppModal} from "../../vo/app-modal";
import {ModalExcuteDeleteType} from "../../constant/modal";

/**
 * Created by lzy on 2017/10/28.
 */
@Component({
  templateUrl: './image.component.html'
})
export class ImageComponent extends BaseComponent implements OnInit{

  public requestAccountId:string;
  public images:Image[] = new Array<Image>();
  public paging:Paging = Paging.instantiation4();
  public pagingParams:PagingParams = PagingParams.instantiation4();
  public uploader: FileUploader = new FileUploader({});
  public commentMaxLength = 50;
  public initCommentMaxLength = 50;
  public commentContent:string = '';
  public hideSubmitComment = true;
  public appModal:AppModal = new AppModal('确定删除', '确定删除吗？', 'confirmDelNoteModal', false);
  public modalRef: BsModalRef;
  public nativeElement = this.elementRef.nativeElement;
  public openCommentDiv:string[] = new Array<string>();
  public globalReply:Reply;
  @ViewChild('appModalTemplate')
  public appModalTemplateDiv:TemplateRef<any>;
  public modalExcuteDeleteType:ModalExcuteDeleteType;
  public imageId:string;

  constructor(
    public route:ActivatedRoute,
    public authorizationService: AuthorizationService,
    public imageService: ImageService,
    public modalService: BsModalService,
    public elementRef:ElementRef,
    public renderer2:Renderer2
  ){
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestAccountId = params.get("account_id")).subscribe();
    this.route.data.subscribe((rlt: {images: any}) => {
      if (!rlt.images.status) {
        this.showMsg = true;
        this.sysMsg = rlt.images.msg;
        setTimeout(() => {this.showMsg = false}, 300);
        return;
      }
      this.showMsg = false;
      this.images = rlt.images.data.images;
      this.paging.bigTotalItems = rlt.images.data.count;
    });
  }

  ngOnInit(): void {
    this.initUploadFileConfig();
  }

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
      this.renderer2.setProperty(commentInput, 'placeholder', '评论' + this.requestAccountId);
    }else { //子回复
      this.renderer2.setProperty(commentInput, 'placeholder', '回复' + subject);
    }
    commentInput.focus();
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
   * 取消模态框
   */
  cancleModal(){
    this.imageId = '';
    this.modalRef.hide();
  }

  /**
   * 执行模态框的删除
   */
  excuteDel(){
    if (this.modalExcuteDeleteType == ModalExcuteDeleteType.DELETE_IMAGE) {
      this.deleteImage();
    }else if (this.modalExcuteDeleteType == ModalExcuteDeleteType.DELETE_COMMENT) {
      this.delComment();
    }
  }

  /**
   * 确定删除图片
   */
  deleteImage() {
    let image = new Image();
    image.account_id = this.authorizationService.getCurrentUser()._id;
    image._id = this.imageId;
    this.imageService.deleteImage(image, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.images = data.data.images;
        this.paging.bigTotalItems = data.data.count;
        this.modalRef.hide();
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
  delComment(){
    this.imageService.delConment(this.globalReply, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.images = data.data;
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
   * 确认删除日记
   */
  onDeleteDocBefore(id:string){
    this.appModal.content = "确定永久删除该图片吗?";
    this.modalExcuteDeleteType = ModalExcuteDeleteType.DELETE_IMAGE;
    this.imageId = id;
    this.modalRef = this.modalService.show(this.appModalTemplateDiv);
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
   * 监听子回复组件回复事件
   * @param noteId
   * @param reply
   */
  onReply(reply:Reply){
    this.globalReply = reply;
    this.openCommentInput(reply.doc_id, reply.parent_id, reply.from_name);
  }

  /**
   * 赞
   * @param id
   */
  onPraise(id: string) {
    let currentUsername = this.authorizationService.getCurrentUser()._id;
    this.imageService.praise(this.requestAccountId, currentUsername, id, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.images = data.data;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  /**
   * 提交评论
   * @param id
   */
  submitComment(id:string){
    this.globalReply.from_name = this.authorizationService.getCurrentUser()._id;
    this.globalReply.account_id = this.requestAccountId;
    this.globalReply.content = this.commentContent;
    this.imageService.submitConment(this.globalReply, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.images = data.data;
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
    this.globalReply.account_id = this.requestAccountId;
    this.modalRef = this.modalService.show(this.appModalTemplateDiv);
  }

  /**
   * 初始化上传参数
   */
  initUploadFileConfig(){
    this.uploader = new FileUploader({
      url: environment.api.uri + MY_IMAGE + '/' + this.authorizationService.getCurrentUser()._id
      + '/' + this.pagingParams.skip + '/' + this.pagingParams.limit,
      itemAlias: "uploadfile",
      headers: [
        {name: "LzyAuthorization", value: this.authorizationService.getCurrentUser().token}
      ],
      removeAfterUpload: true,
      autoUpload: true,
      allowedFileType: ['image']
    });
    this.uploader.onSuccessItem = this.successItem.bind(this);
  }

  /**
   * 上传成功回掉
   * @param item
   * @param response
   * @param status
   * @param headers
   */
  successItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    // 上传媒体成功
    if (status == 200) {
      // 上传媒体后获取服务器返回的数据
      let tempRes = JSON.parse(response);
      if (tempRes.status) {
        this.showSuccess = true;
        this.successMsg = '上传成功';
        setTimeout(() => {this.showSuccess = false}, 2000);
        this.images = tempRes.data.images;
        this.paging.bigTotalItems = tempRes.data.count;
        this.isShow = false;
      } else {
        this.showMsg = true;
        this.sysMsg = tempRes.msg;
        setTimeout(() => {this.showMsg = false}, 2000);
      }
    } else {
      // 上传媒体后获取服务器返回的数据错误
      this.showMsg = true;
      this.sysMsg = '上传失败';
      setTimeout(() => {this.showMsg = false}, 2000);
    }
  }

  /**
   * 实现分页
   * @param event
   */
  public pageChanged(event: any): void {
    if (this.paging.bigTotalItems == -1){
      return;
    }
    this.pagingParams.currentPage = event.page;
    this.pagingParams.pageSize = event.itemsPerPage;
    this.pagingParams.skip = this.pagingParams.getSkip();

    this.imageService.images(this.requestAccountId, this.authorizationService.currentUser.account_id, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(() => {this.showMsg = false}, 2000);
          return;
        }
        this.images = data.data.images;
        this.paging.bigTotalItems = data.data.count;
      }
    );
  }

  /**
   * 上传/取消
   */
  changeUpload(){
    if (this.isShow && this.uploader.isUploading){
      this.uploader.cancelAll();
    }
    this.isShow = !this.isShow;
  }
}
