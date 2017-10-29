import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {StorageType, StorageService} from  '../storage';
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@Injectable()
export class AuthorizationService {
  public static STORAGE_POOL_KEY = "lzyblogger-authorization";
  public static STORAGE_KEY = "current-user";
  public static RELATION_COUNT_KEY = "relation_count_key";
  public storageType: StorageType;
  public relationCount: any;
  public currentUser: any;

  constructor(public storageService: StorageService) {
    this.storageType = StorageType.localStorage;
  }

  setStorageType(storageType: StorageType) {
    this.storageType = storageType;
  }

  setCurrentUser(currentUser: any): void {
    this.storageService.put({
      pool: AuthorizationService.STORAGE_POOL_KEY,
      key: AuthorizationService.STORAGE_KEY,
      storageType: this.storageType
    }, currentUser);

    this.currentUser = currentUser;
  }

  setRelationCount(count: any): void {
    this.storageService.put({
      pool: AuthorizationService.STORAGE_POOL_KEY,
      key: AuthorizationService.RELATION_COUNT_KEY,
      storageType: this.storageType
    }, count);
    this.relationCount = count;
  }

  getCurrentUser(): any {
    if (this.currentUser) {
      return this.currentUser;
    }

    return this.currentUser = this.storageService.get({
      pool: AuthorizationService.STORAGE_POOL_KEY,
      key: AuthorizationService.STORAGE_KEY,
      storageType: this.storageType
    });
  }

  logout() {
    this.currentUser = null;
    return this.storageService.remove({
      pool: AuthorizationService.STORAGE_POOL_KEY,
      key: AuthorizationService.STORAGE_KEY,
      storageType: this.storageType
    });
  }

  isLogin() {
    return !!this.getCurrentUser();
  }

}
