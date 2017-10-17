import {Component, ElementRef, Renderer2, OnDestroy} from "@angular/core";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Router} from "@angular/router";
import {ViewChild} from "@angular/core";
import {SearchService} from "../../core/search/search.service";
import {Subscription} from "rxjs";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnDestroy{

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private keyword:string = '';
  @ViewChild('keywordInput')
  private keywordInput:ElementRef;
  private showSearchFrom:boolean = false;
  subscription: Subscription;

  constructor(
    private authorizationService: AuthorizationService,
    private searchService:SearchService,
    private route: Router,
    private render2:Renderer2
  ){
    this.subscription = this.searchService.missionConfirmed$.subscribe(
      showSearchFrom => {
        this.showSearchFrom = showSearchFrom;
      });
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

