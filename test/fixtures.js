/* istanbul ignore file */
import { validate, ValidationError } from '../src/index';

export const getErrorsAsync = async (...args) => {
  try {
    await validate(...args);
  } catch (err) {
    if (err instanceof ValidationError) {
      return err.errors;
    }
    throw err;
  }
};

export const getErrorsAtPath = (errors, path = '') =>
  errors.find(([p]) => p === path)[1];
