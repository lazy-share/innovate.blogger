import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {CoreModule} from "../../core/core.module";
import {ArticleComponent} from "./article.component";
import {ArticleService} from "./article.service";
import {ArticleResolveService} from "./article-resolve.service";
import {ArticleRoutingModule} from "./article-routing.module";
import {ArticleDetailComponent} from "./article-detail.component";
/**
 * Created by lzy on 2017/10/12.
 */
@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    ArticleRoutingModule
  ],
  providers: [
    ArticleService,
    ArticleResolveService
  ],
  declarations: [
    ArticleComponent,
    ArticleDetailComponent
  ]
})
export class ArticleModule {

}
