export type Ref = {
  ref: string;
};

export type BaseSchema = {
  nullable?: boolean;
  label?: string;
  typeError?: string;
};

export type Options = {
  multiple?: boolean; // whether to stop after a single error at a given path
  abortEarly?: boolean; // whether to stop after a single error anywhere in the schema
  sync?: boolean; // whether validation will be synchronous (see assert)
  contextPrefix?: string; // how to reference context
  context?: Record<string, unknown>; // can be used in conditions/refs
  strict?: boolean; // whether to run transforms
  assert?: boolean; // whether to validate,
  dateParser?: (date: unknown) => Date;
  now?: () => number;
};

export type SyncOptions = Options & {
  sync: true;
};

export function is<R extends Options>(
  schema: Schema,
  value: any,
  options?: R,
): R extends SyncOptions ? boolean : Promise<boolean>;

export function validate<T, R extends Options>(
  schema: Schema,
  value: T,
  options?: R,
): R extends SyncOptions ? T : Promise<T>;

interface ErrorParams {
  label: string;
  schema: string;
  type: string;
}

type InnerError = {
  params: ErrorParams & Record<string, any>;
  message?: string;
};

type Error = [string, InnerError[]];

export function getErrors<R extends Options>(
  schema: Schema,
  value: any,
  options?: R,
): R extends SyncOptions ? Error[] : Promise<Error[]>;

export function cast<T, R extends Options>(
  schema: Schema,
  value: T,
  options?: R,
): R extends SyncOptions ? T : Promise<T>;
