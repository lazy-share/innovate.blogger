import {Component} from "@angular/core";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@Component({
  template: `<hint title="找不到提示" content="系统不存在该账号，去首页" uri="/home"></hint>`
})
export class NotFoundAccountComponent {

}

@Component({
  template: `<hint title="非法提示" content="不合法请求，去首页" uri="/home"></hint>`
})
export class IllegalRequestComponent {

}

@Component({
  template: `<hint title="找不到页面" content="找不到指定的页面，去首页看看" uri="/home"></hint>`
})
export class NotFoundComponent {

}
