import { Ref } from '../common';

type Between = {
  type: 'between';
};

type Integer = {
  type: 'integer';
};

type Max = {
  type: 'max';
  value: Ref | number;
  inclusive?: boolean;
};

type Min = {
  type: 'min';
  value: Ref | number;
  inclusive?: boolean;
};

type MultipleOf = {
  type: 'multipleOf';
  value: Ref | number;
};

export type Tests = Between | Integer | Max | Min | MultipleOf;
