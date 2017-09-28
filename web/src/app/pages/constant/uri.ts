import {environment} from "../../../environments/environment";
/**
 * Created by laizhiyuan on 2017/9/28.
 */
let version = 'v1';
let root = 'http://' + environment.api.host + ':' + environment.api.port + '/' + version + '/api/web';
export const REGISTER_VILIDATE = root + "/register/validate";
export const REGISTER = root + "/register";
export const LOGIN = root + "/login";
