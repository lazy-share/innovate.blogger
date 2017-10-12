import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {ArticleComponent} from "./article.component";
import {ArticleResolveService} from "./article-resolve.service";
/**
 * Created by lzy on 2017/10/12.
 */
const ARTICLES_ROUTERS: Routes = [
  {path : '', redirectTo: '/not-found', pathMatch: 'full'},
  {path: ':username', component: ArticleComponent, resolve: {articles: ArticleResolveService}}
];
@NgModule({
  imports: [
    RouterModule.forChild(ARTICLES_ROUTERS)
  ],
  exports: [
    RouterModule
  ]
})
export class ArticleRoutingModule {

}
