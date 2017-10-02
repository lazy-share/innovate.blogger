/**
 * Created by laizhiyuan on 2017/9/28.
 */
export class AppResponse {
  public status: boolean = true;
  public code: string|number= 200;
  public msg: string = '请求处理成功';
  public data: any = {};
}
