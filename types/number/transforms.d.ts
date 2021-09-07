import { Ref } from '../common';

type Absolute = {
  type: 'absolute';
};

type Round = {
  type: 'round';
  nearest?: Ref | number;
  how?: Ref | 'round' | 'ceil' | 'floor';
};

export type Transforms = Absolute;
