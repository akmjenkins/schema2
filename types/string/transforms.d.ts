import { Ref } from '../common';

type BaseCapitalize = {
  type: 'capitalize';
};

type Capitalize =
  | BaseCapitalize
  | (BaseCapitalize &
      (
        | { all: boolean | Ref }
        | { except: RegExp | string | Ref }
        | { only: RegExp | string | Ref }
      ));

type Lowercase = {
  type: 'lowercase';
};

type Uppercase = {
  type: 'uppercase';
};

type Case = {
  type: 'case';
  value: Ref | 'pascal' | 'kebab' | 'snake' | 'camel';
};

type Slice = {
  type: 'slice';
  start?: Ref | number;
  end?: Ref | number;
};

type Trim = {
  type: 'strim';
  start?: Ref | boolean;
  end?: Ref | boolean;
};

type Strip = {
  type: 'strip';
};

type Replace = {
  type: 'replace';
  pattern: Ref | string | RegExp;
  flags?: Ref | string;
  substitution: Ref | string;
};

type PadEnd = {
  type: 'padEnd';
  targetLength: Ref | number;
  padString: Ref | string;
};

type PadStart = {
  type: 'padStart';
  targetLength: Ref | number;
  padString: Ref | string;
};

type Mask = {
  type: 'mask';
  pattern?: Ref | string | RegExp;
  character?: Ref | string;
  unmasked?: Ref | number;
  start?: boolean;
};

export type Transforms =
  | Capitalize
  | Uppercase
  | Case
  | Slice
  | Trim
  | Replace
  | PadEnd
  | PadStart
  | Mask;
