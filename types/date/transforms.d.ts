type Tersity = {
    type: 'tersity',
    value: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'
}

type ManipulateParams = {
    milliseconds?: number;
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
}

type Add = ManipulateParams & {
    type: 'add';
}

type Subtract = ManipulateParams & {
    type: 'subtract';
}

export type Transforms = Tersity | Add | Subtract