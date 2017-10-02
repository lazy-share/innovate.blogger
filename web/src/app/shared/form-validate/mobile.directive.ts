/**
 * Created by lzy on 2017/10/1.
 */
/**
 * Created by lzy on 2017/10/1.
 */
import {Directive, forwardRef} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from "@angular/forms";
/**
 * Created by laizhiyuan on 2017/9/27.
 */
@Directive({
  selector: '[validMobile]',
  providers: [
    /*Angular在验证流程中的识别出指令的作用，是因为指令把自己注册到了NG_VALIDATORS提供商中，该提供商拥有一组可扩展的验证器*/
    {
      provide: NG_VALIDATORS, useExisting: forwardRef(() => MobileDirective),
      multi: true
    }
  ]
})
export class MobileDirective implements Validator {

  validate(c: AbstractControl): {[key: string]: any} {
    let eleVal: string = c.value;
    return emailValidator(eleVal)(c);
  }

}

export function emailValidator(eleVal:string): ValidatorFn {
  return (c: AbstractControl): {[key: string]: any} => {
    var mobileReg =/^(((13[0-9]{1})|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
    const isOk = !eleVal || (eleVal && mobileReg.test(eleVal));
    return isOk ? null : {'validMobile': {value: "请输入合法格式的手机号码"}};
  };
}
