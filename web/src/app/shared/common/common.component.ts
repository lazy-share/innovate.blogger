import {Component} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@Component({
  template: `<hint title="Not Found Account" content="系统不存在该账号，去注册一个" uri="/register"></hint>`
})
export class NotFoundAccountComponent {

}

@Component({
  template: `<hint title="Illegal Request" content="不合法请求，去首页" uri="/home"></hint>`
})
export class IllegalRequestComponent {

}

@Component({
  template: `<hint title="404" content="找不到指定的资源，去首页看看" uri="/home"></hint>`
})
export class NotFoundComponent {

}

@Component({
  template: `<hint title="500" content="系统错误: {{msg}}<br>返回首页" uri="/home"></hint>`
})
export class SystemErrorComponent {
  public msg:string;

  constructor(
    public route:ActivatedRoute
  ){
    this.route.paramMap.switchMap((params: ParamMap) => this.msg = params.get("msg")).subscribe();
  }

}
