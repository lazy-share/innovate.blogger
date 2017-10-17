import {Component, ElementRef, Renderer2} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Router} from "@angular/router";
import {ViewChild} from "@angular/core";
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
  @ViewChild('keywordInput')
  private keywordInput:ElementRef;

  constructor(
    private authorizationService: AuthorizationService,
    private searchService:SearchService,
    private route: Router,
    private render2:Renderer2
  ){

  }

  logout() {
    this.authorizationService.logout();
    this.route.navigate(['/login']);
  }

  doSearch(){
    this.searchService.announceMission(this.keyword);
  }

  clear(){
    this.render2.setProperty(this.keywordInput.nativeElement, 'value', '');
    this.keyword = '';
  }
}

