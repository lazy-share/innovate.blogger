import {Injectable} from "@angular/core";
import {HttpClient, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {AppResponse} from "../../vo/app-response";
import {MY_NOTES, MY_NOTE, MY_NOTE_PRAISE, MY_NOTE_COMMENT} from "../../constant/uri";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {PagingParams} from "../../vo/paging";
import {Note} from "../../vo/note";
import {SubmitCommentParams} from "../../vo/submit-comment-params";
/**
 * Created by lzy on 2017/10/7.
 */
@Injectable()
export class NoteService {

  constructor(private http: HttpClient,
              private router: Router) {

  }

  notes(requestUsername: string, currentUsername:string, paging: PagingParams): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      MY_NOTES,
      {
        params: new HttpParams().set('username', requestUsername).set('currentUsername',currentUsername).set("paging", JSON.stringify(paging))
      }
    ).map(
      data => {
        return data;
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.router.navigate(['system-error', {msg: err.error.message}]);
        } else {
          this.router.navigate(['system-error', {msg: err.error}],);
        }
      }
    );
  }

  submitNote(note: Note, paging: PagingParams): Observable<AppResponse> {
    return this.http.post<AppResponse>(
      MY_NOTE,
      {note: note, paging: paging}
    ).map(
      data => {
        return data;
      }
    );
  }

  deleteNote(note: Note, paging: PagingParams): Observable<AppResponse> {
    return this.http.delete<AppResponse>(
      MY_NOTE,
      {
        params: new HttpParams().set('note', JSON.stringify(note)).set('paging', JSON.stringify(paging))
      }
    ).map(
      data => {
        return data;
      }
    );
  }

  praise(requestUsername:string, currentUsername: string, id: string): Observable<AppResponse> {
    return this.http.post<AppResponse>(
      MY_NOTE_PRAISE,
      {username: requestUsername, from: currentUsername, id: id, paging: PagingParams.instantiation()}
    ).map(
      data => {
        return data;
      }
    );
  }

  submitConment(submitCommentObj:SubmitCommentParams): Observable<AppResponse> {
    return this.http.post<AppResponse>(
      MY_NOTE_COMMENT,
      {obj: submitCommentObj, paging: PagingParams.instantiation()}
    ).map(
      data => {
        return data;
      }
    );
  }
}
