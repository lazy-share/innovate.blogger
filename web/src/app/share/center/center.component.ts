/**
 * Created by laizhiyuan on 2017/9/29.
 */
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
@Component({
  templateUrl: './center.component.html',
  styleUrls: [
    './center.component.css'
  ]
})
export class CenterComponent implements OnInit{

  private sign:string;
  private accountId:string = "";

  ngOnInit(): void {

    try{
      this.accountId = this.sign.split('-')[1];
    }catch(err){
      this.router.navigate([`/illegal`]);
      return;
    }
    if (!this.accountId) {
      this.router.navigate([`/illegal`]);
      return;
    }
    this.router.navigate([`/center/${this.sign}/info/${this.accountId}`]);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ){
    this.route.paramMap.switchMap((params: ParamMap) => this.sign = params.get('sign')).subscribe();
  }

}
