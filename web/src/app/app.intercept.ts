/**
 * Created by laizhiyuan on 2017/8/1.
 */
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {AuthorizationService} from './core/authorization/authorization.service';
import {Router} from '@angular/router';
import {environment} from './../environments/environment';
import {Account} from "./vo/account";
/**
 * 是否是对象
 * @param value
 */
function isObject(value): boolean {
  return value !== null && typeof value === 'object';
}

/**
 * 是否是undefined
 * @param value
 */
function isUndefined(value) {
  return typeof value === 'undefined';
}

/**
 * 是否是空
 * @param value
 */
function isEmpty(value) {
  return isUndefined(value) || value === null || value === '';
}


@Injectable()
export class APPRequestInterceptor implements HttpInterceptor {
  constructor(private authorizationService: AuthorizationService) {

  }

  /**
   * 请求拦截器 (Request Interceptor)
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let JWT = '';
    if (this.authorizationService.getCurrentUser()) {
      JWT = this.authorizationService.getCurrentUser().token;
    }
    req = req.clone({
      setHeaders: {
        LzyAuthorization: JWT
      },
      url: environment.api.uri +  req.url
    });
    if (!environment.production) {
      console.log(req.url);
      console.log(JSON.stringify(req.headers));
    }
    return next.handle(req);
  }
}

@Injectable()
export class APPResponseInterceptor implements HttpInterceptor {

  constructor(private router: Router,private authorizationService: AuthorizationService) {
  }

  /**
   * 响应拦截器 (Response Interceptor)
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).map(event => {
      console.log('Response map', event);
      if (event instanceof HttpResponse) {
        if (!environment.production) {
          console.log("global response: " + JSON.stringify(event));
        }

        if (!event.body.status && event.body.code == 300) {
          this.authorizationService.logout();
          this.router.navigateByUrl('/login');
          return;
        }else if (!event.body.status && event.body.code == 602){
          this.router.navigateByUrl('/not-account');
          return;
        }else if (!event.body.status && event.body.code == 404){
          this.router.navigateByUrl('/not-found');
          return;
        }
      }
      return event;
    }).catch(err => {
      console.log('Response catch', err);
      if (err instanceof HttpErrorResponse) {
        switch (err.status) {
          case 400:
            return Observable.throw(err);
          case 401:
            return Observable.throw(err);
          case 403:
            return Observable.throw(err);
          case 404:
            return Observable.throw(err);
          case 500:
            return Observable.throw(err);
          default:
            return Observable.throw(err);
        }
      }
    });
  };
}
