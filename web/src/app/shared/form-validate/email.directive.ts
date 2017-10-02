/**
 * Created by lzy on 2017/10/1.
 */
import {Directive, forwardRef} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from "@angular/forms";
/**
 * Created by laizhiyuan on 2017/9/27.
 */
@Directive({
  selector: '[validEmail]',
  providers: [
    /*Angular在验证流程中的识别出指令的作用，是因为指令把自己注册到了NG_VALIDATORS提供商中，该提供商拥有一组可扩展的验证器*/
    {
      provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailDirective),
      multi: true
    }
  ]
})
export class EmailDirective implements Validator {

  validate(c: AbstractControl): {[key: string]: any} {
    let eleVal: string = c.value;
    return emailValidator(eleVal)(c);
  }

}

export function emailValidator(eleVal:string): ValidatorFn {
  return (c: AbstractControl): {[key: string]: any} => {
    var emailReg =/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const isOk = !eleVal || (eleVal && emailReg.test(eleVal));
    return isOk ? null : {'validEmail': {value: "邮箱不合法"}};
  };
}
