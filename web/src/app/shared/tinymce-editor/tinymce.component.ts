import {Component, EventEmitter, AfterViewInit, OnDestroy, Input, Output} from "@angular/core";
import "tinymce";
import "tinymce/themes/modern";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/paste";
import "tinymce/plugins/code";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/print";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/uploadimage";
import "tinymce/plugins/autosave";
import {MY_ARTICLE_UPLOAD_IMAGES} from "../../constant/uri";
import {environment} from "../../../environments/environment";
import {AuthorizationService} from "../../core/authorization/authorization.service";
declare var tinymce: any;
/**
 * Created by laizhiyuan on 2017/10/7.
 *  ng generate component ArticleComponent
 *  xcopy /I/E node_modules\tinymce\skins src\assets\skins
 */
@Component({
  selector: 'tinymce-editor',
  templateUrl: './tinymce.component.html'
})
export class TinymceEditorComponent implements AfterViewInit, OnDestroy{
  @Input() elementId: String;
  @Output() onEditorContentChange = new EventEmitter();

  constructor(
    public authorizationService: AuthorizationService
  ){}

  public editor:any;
  ngAfterViewInit() {
    let token = this.authorizationService.getCurrentUser().token;
    let username = this.authorizationService.getCurrentUser().username;
    tinymce.init({
      selector: '#' + this.elementId,
      language: 'zh_CN',
      language_url : "../../../assets/skins/langs/zh_CN.js",
      skin_url: '../../../assets/skins/lightgray',
      content_css: '../../../assets/skins/lightgray/content.min.css',
      plugins: [
        'advlist autolink lists link charmap print preview anchor textcolor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime autosave table contextmenu paste code wordcount uploadimage'
      ],
      toolbar: 'uploadimage | undo redo |  formatselect | bold italic forecolor backcolor  | alignleft aligncenter alignright alignjustify | numlist outdent indent | removeformat | help',
      height:"480",
      image_advtab: true,
      images_upload_url: environment.api.uri + MY_ARTICLE_UPLOAD_IMAGES,
      images_upload_credentials: true,
      menubar: true,
      browser_spellcheck: true,
      token: token,
      username:username,
      contextmenu: true,
      schema: 'html5',
      autosave_retention: "30m", //指定持续时间编辑器内容应保留在本地存储
      autosave_restore_when_empty: false, //指定在初始化时编辑器为空时，TinyMCE是否应自动还原存储在本地存储中的内容
      autosave_prefix: "tinymce-autosave-{path}{query}-{id}-", //设置用于本地存储键的前缀
      autosave_interval: "20s", //指定编辑器在拍摄当前内容的快照并将其保存到本地存储之间等待的时间
      autosave_ask_before_unload: true, //当尝试关闭当前窗口时编辑器是否应提示用户建议他们有未保存的更改
      advlist_bullet_styles: "square",
      advlist_number_styles: "lower-alpha",
      setup: (editor:any) => {
        this.editor = editor;
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.onEditorContentChange.emit(content);
        });
      }
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  clearContent(){
    tinymce.activeEditor.setContent('');
  }

  setContent(content:string){
    tinymce.activeEditor.setContent(content);
  }
}
