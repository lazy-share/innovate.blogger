import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ArticleType} from "../../vo/article";
/**
 * Created by lzy on 2017/10/13.
 */
@Component({
  selector: 'article-nav',
  templateUrl: './article-nav.component.html'
})
export class ArticleNavComponent {

  @Input()
  private sysDefaultTypes: ArticleType[] = new Array <ArticleType>();
  @Input()
  private definedTypes: ArticleType[] = new Array<ArticleType>();
  private currentShowType: string = '选择文章类型';
  @Output()
  private onSelectType = new EventEmitter<string>();
  @Output()
  private onDeleteType = new EventEmitter<string>();
  @Output()
  private onCreateType = new EventEmitter<ArticleType>();
  @Output()
  private onChangeIsPrivate = new EventEmitter<boolean>();
  @Output()
  private onDrafts = new EventEmitter();
  private newTypeName:string;
  private isPrivate:boolean = false;


  selectType(type_id: string, type_name:string) {
    this.onSelectType.emit(type_id);
    this.currentShowType = type_name;
  }

  deleteType(type_id: string) {
    this.onDeleteType.emit(type_id);
  }

  createType(){
    let articleType = new ArticleType();
    articleType.name = this.newTypeName;
    this.onCreateType.emit(articleType);
    this.newTypeName = '';
  }

  drafts() {
    this.onDrafts.emit();
  }

  changeCurrentShowType(name:string){
    this.currentShowType = name;
  }

  setIsPrivate(isPrivate:boolean){
    this.isPrivate = isPrivate;
  }

  initDefaultData(){
    this.isPrivate = false;
  }

  changeIsPrivate(){
    this.onChangeIsPrivate.emit(this.isPrivate);
  }
}
