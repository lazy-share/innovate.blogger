import {Component, EventEmitter, AfterViewInit, OnDestroy,Input, Output} from "@angular/core";
import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/table';
import 'tinymce/plugins/link';
declare var tinymce: any;
/**
 * Created by lzy on 2017/10/7.
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
      plugins: ['link', 'table'],
      skin_url: '../../assets/skins/lightgray',
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
