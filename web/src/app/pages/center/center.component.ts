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

  private requestUsername:string;

  ngOnInit(): void {
    //this.router.navigate([{outlets: {center: ['/center/info/111111']}}]);
  /*  this.router.navigate([`../info/${this.requestUsername}`, {outlet:}], {relativeTo: this.route});*/
  this.router.navigateByUrl('/center/test/222222')
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ){
    this.route.paramMap.switchMap((params: ParamMap) => this.requestUsername = params.get('username')).subscribe();
  }

}
