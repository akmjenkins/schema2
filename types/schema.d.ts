import { Ref, BaseSchema } from './common';
import { Tests as StringTests, Transforms as StringTransforms } from './string';
import { Tests as MixedTests, Transforms as MixedTransforms } from './mixed';
import {
  Tests as BooleanTests,
  Transforms as BooleanTransforms,
} from './boolean';
import { Tests as NumberTests, Transforms as NumberTransforms } from './number';
import { Tests as DateTests, Transforms as DateTransforms } from './date';
import { Tests as ArrayTests, Transforms as ArrayTransforms } from './array';
import { Tests as ObjectTests, Transforms as ObjectTransforms } from './object';

type Condition<T extends Schema> = {
  when: Record<string, Schema>;
  then?: T extends MixedSchema ? Partial<Schema> : Partial<T>;
  otherwise?: T extends MixedSchema ? Partial<Schema> : Partial<T>;
};

export type MixedSchema = BaseSchema & {
  type: 'mixed';
  tests?: MixedTests[];
  transforms?: MixedTransforms[];
  conditions?: Condition<MixedSchema>[];
};

export type StringSchema = BaseSchema & {
  type: 'string';
  tests?: StringTests[];
  transforms?: StringTransforms[];
  conditions?: Condition<StringSchema>[];
};

export type NumberSchema = BaseSchema & {
  type: 'number';
  tests?: NumberTests[];
  transforms?: NumberTransforms[];
  conditions?: Condition<NumberSchema>[];
};

export type DateSchema = BaseSchema & {
  type: 'date';
  tests?: DateTests[];
  transforms?: DateTransforms[];
  conditions?: Condition<DateSchema>[];
};

export type BooleanSchema = BaseSchema & {
  type: 'boolean';
  tests?: BooleanTests[];
  transforms?: BooleanTransforms[];
  conditions?: Condition<BooleanSchema>[];
};

export type TupleSchema = BaseSchema & {
  type: 'array';
  inner?: Schema[];
  tests?: ArrayTests[];
  transforms?: ArrayTransforms[];
  conditions?: Condition<TupleSchema>[];
};

export type ArraySchema = BaseSchema & {
  type: 'array';
  inner?: Schema;
  tests?: ArrayTests[];
  transforms?: ArrayTransforms[];
  conditions?: Condition<ArraySchema>[];
};

export type ObjectSchema = BaseSchema & {
  type: 'object';
  inner?: Record<string, Schema | Ref>;
  tests?: ObjectTests[];
  transforms?: ObjectTransforms[];
  conditions?: Condition<ObjectSchema>[];
};

export type Schema =
  | MixedSchema
  | StringSchema
  | NumberSchema
  | DateSchema
  | BooleanSchema
  | TupleSchema
  | ArraySchema
  | ObjectSchema;
