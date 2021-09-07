import { Ref } from '../common';

type Required = {
  type: 'required';
};

type Length = {
  type: 'length';
  value: Ref | number;
};

type Min = {
  type: 'min';
  value: Ref | number;
  inclusive?: boolean;
};

type Max = {
  type: 'max';
  value: Ref | number;
  inclusive?: boolean;
};

type Between = {
  type: 'bewteen';
  min: Ref | number;
  max: Ref | number;
  inclusive?: Ref | boolean;
};

type Includes = {
  type: 'includes';
  value: Ref | string;
};

type Matches = {
  type: 'matches';
  pattern: Ref | string | RegExp;
  flags?: Ref | string;
};

export type Tests =
  | Required
  | Length
  | Min
  | Max
  | Between
  | Includes
  | Matches;
