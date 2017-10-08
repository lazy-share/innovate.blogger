/**
 * Created by lzy on 2017/10/7.
 */
export class Paging {
  public maxSize:number = 5;
  public bigTotalItems:number = 175;
  public bigCurrentPage:number = 1;
  public numPages:number = 0;
  public firstText:string = '第一页';
  public previousText:string = '上一页';
  public nextText:string = '下一页';
  public lastText:string = '最后一页';

  static instantiation(): Paging{
    let vo: Paging = new Paging();
    vo.bigCurrentPage = 1;
    vo.numPages = 0;
    vo.firstText = '第一页';;
    vo.previousText = '上一页';
    vo.nextText = '下一页';
    vo.lastText = '最后一页';
    vo.bigTotalItems = 0;
    vo.maxSize = 5;
    return vo;
  }
}

export class PagingParams {
  public limit:number; //一次查多少条数据
  public skip:number = 0; //从第几条数据开始
  public currentPage:number;
  public pageSize:number;
  public keywork:string;

  getSkip():number {
    if (this.currentPage <= 1){
      return 0;
    }
    return (this.currentPage - 1) * this.pageSize;
  }

  static instantiation(): PagingParams{
    let vo = new PagingParams();
    vo.limit = 10;
    vo.keywork = '';
    vo.currentPage = 1;
    vo.skip = vo.getSkip();
    vo.pageSize = 10;
    return vo;
  }
}
