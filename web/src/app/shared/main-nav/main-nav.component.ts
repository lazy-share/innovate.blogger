import {Component, ElementRef} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Router} from "@angular/router";
import {ViewChild} from "@angular/core/src/metadata/di";
import {SearchService} from "../../core/search/search.service";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  private keyword:string = '';

  constructor(
    private authorizationService: AuthorizationService,
    private searchService:SearchService,
    private route: Router
  ){

  }

  logout() {
    this.authorizationService.logout();
    this.route.navigate(['/login']);
  }

  doSearch(){
    if (this.keyword){
      this.searchService.doSearch(this.keyword);
    }
  }
}

