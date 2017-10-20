import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {ParamMap, ActivatedRoute} from "@angular/router";
import {Paging, PagingParams} from "../../vo/paging";
import {BaseComponent} from "../common/BaseComponent";
import {FileItem, FileUploader, ParsedResponseHeaders} from "ng2-file-upload";
import {environment} from "../../../environments/environment";
import {MY_MEDIA_UPLOAD} from "../../constant/uri";
import {Media} from "../../vo/media";
import {MediaService} from "./media.service";
import {AppModal} from "../../vo/app-modal";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
/**
 * Created by lzy on 2017/10/18.
 */
@Component({
  templateUrl: './media.component.html'
})
export class MediaComponent extends BaseComponent implements OnInit{
  ngOnInit(): void {
    this.initUploadFileConfig();
    this.route.data.subscribe((data: {medias: any}) => {
      this.medias = data.medias.data.medias;
      this.paging.bigTotalItems = data.medias.data.count;
    })
  }

  private requestUsername: string;
  private paging: Paging = Paging.instantiation6();
  private pagingParams = PagingParams.instantiation6();
  private uploader: FileUploader = new FileUploader({});
  private medias:Media[] = new Array<Media>();
  private appModal:AppModal = new AppModal('确定删除', '确定永久删除该媒体吗？', 'confirmDelNoteModal', false);
  private globalMediaId:string;
  public modalRef: BsModalRef;
  @ViewChild('appModalTemplate')
  public appModalTemplateDiv:TemplateRef<any>;

  constructor(
    private authorizationService: AuthorizationService,
    private mediaService:MediaService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
  ){
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
  }
  initUploadFileConfig(){
    this.uploader = new FileUploader({
      url: environment.api.uri + MY_MEDIA_UPLOAD + '/' + this.authorizationService.getCurrentUser().username
      + '/' + this.pagingParams.skip + '/' + this.pagingParams.limit,
      itemAlias: "uploadfile",
      headers: [
        {name: "LzyAuthorization", value: this.authorizationService.getCurrentUser().token}
      ],
      removeAfterUpload: true,
      autoUpload: true
    });
    this.uploader.onSuccessItem = this.successItem.bind(this);
  }

  successItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    // 上传媒体成功
    if (status == 200) {
      // 上传媒体后获取服务器返回的数据
      let tempRes = JSON.parse(response);
      if (tempRes.status) {
        this.medias = tempRes.data.medias;
        this.paging.bigTotalItems = tempRes.data.count;
        this.isShow = false;
      } else {
        this.showMsg = true;
        this.sysMsg = '上传失败';
      }
    } else {
      // 上传媒体后获取服务器返回的数据错误
      this.showMsg = true;
      this.sysMsg = '上传失败';
    }
  }

  changeBtn() {
    this.isShow = !this.isShow;
  }

  toDeleteMedia(id:string){
    this.globalMediaId = id;
    this.modalRef = this.modalService.show(this.appModalTemplateDiv);
  }

  cancleModal(){
    this.globalMediaId = '';
    this.modalRef.hide();
  }

  excuteDel(){
    this.mediaService.deleteMedia(this.globalMediaId,this.authorizationService.getCurrentUser().username, this.pagingParams).subscribe(
      data => {
        this.modalRef.hide();
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          setTimeout(() => {this.showMsg = false}, 3000);
          return;
        }
        this.medias = data.data.medias;
        this.paging.bigTotalItems = data.data.count;
      },
      err => {
        this.modalRef.hide();
        this.showMsg = true;
        this.sysMsg = '系统错误';
        setTimeout(() => {this.showMsg = false}, 3000);
      }
    );
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

    this.mediaService.medias(this.requestUsername, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.medias = data.data.medias;
        this.paging.bigTotalItems = data.data.count;
      }
    );
  }
}
