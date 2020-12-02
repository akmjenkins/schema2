export const syncReturnedAsync = (warn, name, label) =>
  warn(
    `Test '${name}' returned a promise during synchronous validation at '${label}', it's result will be ignored`,
  );

export const syncReturnedAsyncAndFailed = (warn, name, label, result) =>
  warn(
    `Test ${name} returned a promise during synchronous validation at '${label}' and subsequently failed with result '${result}'`,
  );

export const syncReturnedAsyncAndThrew = (warn, name, label, err) =>
  warn(
    `Test '${name}' returned a rejected promise during synchronous validation at '${label}' and subsequently threw an error - validators must, synchronously or asynchronously, return true, false, or call createError, they must not throw errors. This result will be ignored`,
    err,
  );

export const asyncThrew = (warn, name, label, err) =>
  warn(
    `Test '${name}' returned a rejected promise while validating '${label}' - validators must, synchronously or asynchronously, return true, false, or call createError, they must not throw errors. This result will be ignored`,
    err,
  );

export const syncThrew = (warn, name, label, err) =>
  warn(
    `Test '${name}' threw an error while validating '${label}' - validators must, synchronously or asynchronously, return true, false, or call createError, they must not throw errors. This result will be ignored`,
    err,
  );

export const innerSchemaUnsupported = (warn, type) =>
  warn(`An inner schema is only not supported on '${type}' - ignoring`);

export const noOperator = (warn, type, name) =>
  warn(`No '${type}' has been found with '${name}' - skipping`);
