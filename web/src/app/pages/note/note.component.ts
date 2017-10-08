import {Component, OnInit, TemplateRef} from "@angular/core";
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
import {BsModalService, BsModalRef} from "ngx-bootstrap";
/**
 * Created by lzy on 2017/10/6.
 */
@Component({
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent extends BaseComponent implements OnInit {

  private requestUsername: string;
  private paging: Paging = Paging.instantiation();
  private notes: Note[] = new Array<Note>();
  private content: string;
  private contentNumber: number = 200;
  private initContentNumber: number = 200;
  private head_portrait: string;
  private appModal:AppModal = new AppModal('确定删除', '确定删除吗？', 'confirmDelNoteModal', false);
  public modalRef: BsModalRef;

  constructor(private route: ActivatedRoute,
              private authorizationService: AuthorizationService,
              private noteService: NoteService,
              private modalService: BsModalService) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
  }

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

  initNotes(data: any) {
    this.content = '';
    this.notes = data.data.notes;
    this.paging.bigTotalItems = data.data.count;
    this.head_portrait = data.data.head_portrait;
    this.showMsg = false;
    this.isShow = false;
  }

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

  keyup() {
    if (this.content) {
      this.contentNumber = this.initContentNumber - this.content.length;
    }
  }

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

  private noteId:string;
  toDeleteNote(id:string, template: TemplateRef<any>){
    this.noteId = id;
    this.modalRef = this.modalService.show(template);
  }

  cancleModal(){
    this.noteId = '';
    this.modalRef.hide();
  }

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

  praise(id: string) {
    let currentUsername = this.authorizationService.getCurrentUser().username;
    this.noteService.praise(this.requestUsername, currentUsername, id).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.notes = data.data;
        /*let praiseArr: string[] = new Array<string>();
        let index: number = 0;
        let flag: boolean = true;
        for (let i = 0; i < this.notes.length; i++) {
          if (this.notes[i]._id == id) { //找到数组中的日记
            praiseArr = this.notes[i].praise; //拿出这个日记的赞
            index = i; //记住这个数组的索引
            break;
          }
        }
        for (let k = 0; k < praiseArr.length; k++) {
          if (praiseArr[k] == currentUsername) { //已经赞过
            praiseArr.splice(k, 1);
            this.notes[index].praise = praiseArr;
            flag = false;
            break;
          }
        }
        if (flag) {
          this.notes[index].praise.push(currentUsername);
        }*/
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }
}
