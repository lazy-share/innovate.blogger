import {Directive, forwardRef, Input} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from "@angular/forms";
/**
 * Created by laizhiyuan on 2017/9/27.
 */
@Directive({
  selector: '[compareTo]',
  providers: [
    /*Angular在验证流程中的识别出指令的作用，是因为指令把自己注册到了NG_VALIDATORS提供商中，该提供商拥有一组可扩展的验证器*/
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CompareToDirective),
      multi: true }
  ]
})
export class CompareToDirective implements Validator{

  @Input()
  public target: string;

  validate(c: AbstractControl): {[key: string]: any} {
      let target: string = c.value;
      let c2: AbstractControl = c.root.get(this.target);

      return compareToValidator(c2.value, target);
  }

}

export function compareToValidator(compareTo:string, target:string): ValidatorFn {
  return (): {[key: string]: any} => {
    const isOk = compareTo && target && compareTo === target;
    return isOk ? {'compareTo': null} : {'compareTo': {value: "两次输入不一致"}};
  };
}
