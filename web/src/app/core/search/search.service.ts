import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
/**
 * Created by laizhiyuan on 2017/10/16.
 */
@Injectable()
export class SearchService {

  // Observable string sources
  private searchSource = new Subject<string>();

  // Observable string streams
  search$ = this.missionAnnouncedSource.asObservable();

  // Service message commands
  doSearch(keyword: string) {
    this.search$.next(keyword);
  }

}
