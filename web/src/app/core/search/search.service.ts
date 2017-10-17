import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
/**
 * Created by laizhiyuan on 2017/10/16.
 */
@Injectable()
export class SearchService {

  // Observable string sources
  private missionAnnouncedSource = new Subject<string>();

  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();

  // Service message commands
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }

}
