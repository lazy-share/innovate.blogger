import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppResponse} from "../../vo/app-response";
import {NEWS_TYPES, NEWS} from "../../constant/uri";
import {BaseComponent} from "../common/BaseComponent";
import {Paging, PagingParams} from "../../vo/paging";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit{

  public newsTypes:any[] = new Array<any>();
  public news: any[] = new Array<any>();
  public paging: Paging = Paging.instantiation6();
  public pagingParams = PagingParams.instantiation6();
  public globalType:string;

  constructor(
    public http:HttpClient
  ) {
    super();
  }

  changeTab(type:string){
    this.pagingParams = PagingParams.instantiation6();
    this.globalType = type;
    if (this.paging.bigCurrentPage > 1){
      this.paging = Paging.instantiation6();
      this.loadNews(type);
    }else {
      this.loadNews(type);
    }
  }

  ngOnInit(): void {
    this.loadNewsTypes();
  }

  /**
   * 实现分页
   * @param event
   */
  public pageChanged(event: any): void {
    this.pagingParams.currentPage = event.page;
    this.pagingParams.pageSize = event.itemsPerPage;
    this.pagingParams.skip = this.pagingParams.getSkip();

    this.loadNews(this.globalType);
  }

  loadNews(type:string){
    this.http.get<AppResponse>(
      NEWS,
      {
        params: new HttpParams().set('paging', JSON.stringify(this.pagingParams)).set('type', type)
      }
    ).subscribe(
      data => {
        if (!data.status){
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.news = data.data.news;
        this.paging.bigTotalItems = data.data.count;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  loadNewsTypes(){
    this.http.get<AppResponse>(
      NEWS_TYPES
    ).subscribe(
      data => {
        if (!data.status){
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.newsTypes = data.data;
        this.globalType = this.newsTypes[0].no;
        this.loadNews(this.newsTypes[0].no);
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

}
