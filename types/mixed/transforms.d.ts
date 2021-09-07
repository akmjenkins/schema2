import { Ref } from '../common';

type Const = {
  type: 'const';
  value: Ref | any;
};

type Default = {
  type: 'default';
  value: Ref | any;
};

export type Transforms = Const | Default;
