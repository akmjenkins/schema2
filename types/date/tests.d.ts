import { Ref } from "../common";
import { Tests as NumberTests } from "../number";

type Tersity = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'millisecond';

type Part = {
    type: 'part';
    part: 'date' | Tersity;
    tests: Ref | Ref[] | NumberTests[];
    utc?: Ref | boolean;
}

type Max = {
    type: 'max';
    value: Ref | Date | string | number;
    tersity?: Ref | Tersity;
    inclusive?: Ref | boolean;
}

type Min = {
    type: 'min';
    value: Ref | Date | string | number;
    tersity?: Ref | Tersity;
    inclusive?: Ref | boolean;
}

type Between = {
    type: 'between';
    min: Ref | Date | string | number;
    max: Ref | Date | string | number;
    tersity?: Ref | Tersity;
    inclusive?: Ref | boolean;
}

type Future = {
    type: 'future'
}

type Past = {
    type: 'past'
}

export type Tests = Part | Max | Min | Between | Future | Past