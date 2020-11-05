import {ArrayValue} from './array-value';
import {NumberValue} from './number-value';
import {RecordValue} from './record-value';
import {StringValue} from './string-value';

describe('array value', () => {
  describe('can validate', () => {
    it('min and max', () => {
      const v = new ArrayValue({
        min: 1,
        max: 2,
      });

      expect(v.validate([])).not.toBeNull();

      expect(v.validate([1, 2, 3])).not.toBeNull();

      expect(v.validate([1])).toBeNull();
      expect(v.validate(['yo'])).toBeNull();
      expect(v.validate([true])).toBeNull();
      expect(v.validate(null)).toBeNull();
      expect(v.validate(undefined)).toBeNull();
    });

    it('each', () => {
      const v = new ArrayValue({
        each: new NumberValue({required: true, max: 5}),
      });

      expect(v.validate([6, 7, 8])).not.toBeNull();
      expect(v.validate(['hello'])).not.toBeNull();
      expect(v.validate([true])).not.toBeNull();
      expect(v.validate([0, 1, 2, 3, 4, null])).not.toBeNull();
      expect(v.validate([0, 1, 2, 3, 4, undefined])).not.toBeNull();

      expect(v.validate(null)).toBeNull();
      expect(v.validate(undefined)).toBeNull();
      expect(v.validate([0, 1, 2, 3, 4, 5])).toBeNull();
    });

    it('each RecordValue', () => {
      const v = new ArrayValue({
        min: 2,
        max: 4,
        each: new RecordValue({
          foo: new NumberValue({required: true, min: 1, max: 2}),
          bar: new ArrayValue({
            required: true,
            min: 2,
            max: 3,
            each: new StringValue({required: true, emptyAllowed: false}),
          }),
        }),
      });

      expect(
        v.validate([
          {foo: 1, bar: ['foo', 'bar']},
          {foo: 2, bar: ['Coveo', 'JSUI']},
        ])
      ).toBeNull();
      expect(v.validate([{foo: 1, bar: ['foo', 'bar']}])).not.toBeNull();
      expect(
        v.validate([
          {foo: 1, bar: ['foo', 'bar']},
          {foo: 5, bar: ['Coveo', 'JSUI']},
        ])
      ).not.toBeNull();
      expect(
        v.validate([
          {foo: 1, bar: ['foo']},
          {foo: 2, bar: ['Coveo', 'JSUI']},
        ])
      ).not.toBeNull();
      expect(
        v.validate([
          {foo: 1, bar: ['foo', '']},
          {foo: 2, bar: ['Coveo', 'JSUI']},
        ])
      ).not.toBeNull();
      expect(
        v.validate([
          {foo: 1, bar: ['foo', 3]},
          {foo: 2, bar: ['Coveo', 'JSUI']},
        ])
      ).not.toBeNull();
    });

    it('required', () => {
      const v = new ArrayValue({
        required: true,
      });

      expect(v.validate(null)).not.toBeNull();
      expect(v.validate(undefined)).not.toBeNull();

      expect(v.validate([null])).toBeNull();
      expect(v.validate([undefined])).toBeNull();
      expect(v.validate([1, 2, 3, 4, 5])).toBeNull();
      expect(v.validate([true, false])).toBeNull();
    });
  });
});
