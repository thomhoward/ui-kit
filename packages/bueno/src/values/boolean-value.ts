import {ValueConfig, Value, isUndefined} from './value';
import {SchemaValue} from '../schema';

type BooleanValueConfig<trueOrFalse = boolean> = ValueConfig<trueOrFalse>;

export class BooleanValue<trueOrFalse = boolean>
  implements SchemaValue<trueOrFalse> {
  private value: Value<trueOrFalse>;
  constructor(config: BooleanValueConfig<trueOrFalse> = {}) {
    this.value = new Value<trueOrFalse>(config);
  }

  public validate(value: trueOrFalse) {
    const valueValidation = this.value.validate(value);
    if (valueValidation) {
      return valueValidation;
    }

    if (!isBooleanOrUndefined(value)) {
      return 'value is not a boolean.';
    }

    return null;
  }

  public get default() {
    return this.value.default;
  }

  public get required() {
    return this.value.required();
  }
}

export function isBooleanOrUndefined(
  value: unknown
): value is undefined | boolean {
  return isUndefined(value) || isBoolean(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}
