import {Component, OnInit} from "@angular/core";
import "rxjs/add/operator/switchMap";
import {BaseComponent} from "../common/BaseComponent";
import {Account} from "../vo/account";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {InfoService} from "./info.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@Component({
  templateUrl: './info.component.html',
  styleUrls: [
    './info.component.css'
  ]
})
export class InfoComponent extends BaseComponent implements OnInit{

   private requestUsername;
   private accountInfo: Account = Account.instantiation();
   private sessionUsername: string = this.authorizationService.getCurrentUser().username;

   constructor(
     private authorizationService: AuthorizationService,
     private infoService: InfoService,
     private route: ActivatedRoute,
     private router: Router
   ){
     super();
     console.log("99999999999999999");
     this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get("username")).subscribe();
   }

   ngOnInit(): void {
    /* if (!this.requestUsername) {
       this.router.navigate(['/center/not-found-account']);
       return;
     }
     this.infoService.initAccountInfo(this.requestUsername).subscribe(
       data => {
         if (!data.status){
           if (data.code == 602){
             this.router.navigate(['/center/not-found-account']);
             return;
           }
           this.accountInfo = Account.instantiation();
           this.showMsg = true;
           this.sysMsg = data.msg;
           return;
         }
         this.showMsg = false;
         this.accountInfo = data.data;
       },
       err => {
         this.showMsg = true;
         this.sysMsg = "服务器错误";
       }
     );*/
   }

   updateInfo() {

   }

}
