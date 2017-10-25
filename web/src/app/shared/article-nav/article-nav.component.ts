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
  public sysDefaultTypes: ArticleType[] = new Array <ArticleType>();
  @Input()
  public definedTypes: ArticleType[] = new Array<ArticleType>();
  public currentShowType: string = '选择文章类型';
  @Output()
  public onSelectType = new EventEmitter<string>();
  @Output()
  public onDeleteType = new EventEmitter<string>();
  @Output()
  public onCreateType = new EventEmitter<ArticleType>();
  @Output()
  public onChangeIspublic = new EventEmitter<boolean>();
  @Output()
  public onDrafts = new EventEmitter();
  public newTypeName:string;
  public ispublic:boolean = false;


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

  setIspublic(ispublic:boolean){
    this.ispublic = ispublic;
  }

  initDefaultData(){
    this.ispublic = false;
  }

  changeIspublic(){
    this.onChangeIspublic.emit(this.ispublic);
  }
}
