import {Component, EventEmitter, AfterViewInit, OnDestroy,Input, Output} from "@angular/core";
import 'tinymce';
import 'tinymce/themes/modern';

import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/code';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/textcolor';
declare var tinymce: any;
/**
 * Created by laizhiyuan on 2017/10/7.
 *  ng generate component ArticleComponent
 *  xcopy /I/E node_modules\tinymce\skins src\assets\skins
 */
@Component({
  selector: 'tinymce-editor',
  template: `<textarea  id="{{elementId}}"></textarea >`
})
export class TinymceEditorComponent implements AfterViewInit, OnDestroy{
  @Input() elementId: String;
  @Output() onEditorContentChange = new EventEmitter();
  editor;
  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      language: 'zh_CN',
      language_url : "../../../assets/skins/langs/zh_CN.js",
      skin_url: '../../../assets/skins/lightgray',
      plugins: [
        'advlist autolink lists link image charmap print preview anchor textcolor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code wordcount'
      ],
      toolbar: 'insert | undo redo |  formatselect | bold italic forecolor backcolor  | alignleft aligncenter alignright alignjustify | numlist outdent indent | removeformat | help',
      height:"480",
      image_advtab: true,
      menubar: true,
      setup: editor => {
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
}
