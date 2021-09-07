import { Schema } from '../schema';
import { Ref } from '../common';

type BaseIsNot = { value: Ref | any } & { schema: Ref | Schema };
type BaseNotOneOf = { values: Ref | Ref[] | any[] } & {
  schemas: Ref | Ref[] | Schema[];
};

type Is = { type: 'is' } & BaseIsNot;

type Not = { type: 'not' } & BaseIsNot;

type OneOf = { type: 'oneOf' } & BaseNotOneOf;
type NotOneOf = { type: 'notOneOf' } & BaseNotOneOf;

type Different = {
  type: 'different';
  ref: string;
};

type Same = {
  type: 'same';
  ref: string;
};

export type Tests = Same | Different | Is | Not | OneOf | NotOneOf;
