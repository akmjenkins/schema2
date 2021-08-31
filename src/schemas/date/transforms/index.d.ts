type Tersity = {
    type: 'tersity',
    value: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'
}

type ManpulateParams = {
    milliseconds?: number;
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
}

type Add = ManpulateParams & {
    type: 'add';
}

type Subtract = ManpulateParams & {
    type: 'subtract';
}

export type Transforms = Tersity | Add | Subtract