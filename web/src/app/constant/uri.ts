/**
 * Created by laizhiyuan on 2017/9/28.
 */
let version = 'v1';
//let root = 'http://' + environment.api.host + ':' + environment.api.port + '/' + version + '/api/web';
let root = '';

//公开URI
export const REGISTER_VILIDATE = root + "/register/validate";
export const REGISTER = root + "/register";
export const LOGIN = root + "/login";
export const FORGET_VALIDATE = root + "/forget/validate";
export const FORGET = root + "/forget";

//受保护URI
export const ACCOUNT_INFO = root + "/private/account/info";
export const ADDRESS_PROVINCES = root + "/private/address/provinces";
export const ADDRESS_CITYS = root + "/private/address/citys";
export const ADDRESS_COUNTYS = root + "/private/address/countys";
export const ADDRESS_STREETS = root + "/private/address/streets";
export const ACCOUNT_INFO_HEADER = root + "/private/account/info/head";
export const MY_ATTENTIONS = root + "/private/my/attentions";
export const MY_FANS = root + "/private/my/fans";
export const MY_ATTENTION = root + "/private/my/attention";
export const MY_VISITORS = root + "/private/my/visitors";
export const MY_NOTES = root + "/private/my/notes";
export const MY_NOTE = root + "/private/my/note";
export const MY_NOTE_PRAISE = root + "/private/my/note/praise";
