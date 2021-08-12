const match = /\$\{\s*(\w+)\s*\}/g;
const interpolate = (subject = '', params = {}) =>
  subject.replace(match, (_, t) => params[t]);

const defaultMessages = {
  default: '${label} is invalid',
  required: '${label} is required',
  between: '${label} must be between ${low} and ${high}',
  defined: '${label} must be defined',
  different: '${label} cannot be the same as ${value}',
  same: '${label} must be the same as ${value}',
  not: '${label} must not be ${value}',
  is: '${label} must be ${value}',
  includes: '${label} must include ${value}',
  matches: '${label} must match ${regexp}',
  requireKeys: ({ label, missing }) =>
    `${label} is missing the following required keys: ${missing.join(', ')}`,
  typeError:
    '${label} must be a ${schema} type, unable to coerce/use value ${value}',
  oneOf: ({ label, values }) =>
    `${label} must be ${
      values.length === 1 ? values[0] : `one of ${values.join(', ')}`
    }`,
  notOneOf: ({ label, values }) =>
    `${label} must not be ${
      values.length === 1 ? values[0] : `one of ${values.join(', ')}`
    }`,
  'string.max': '${label} must not be longer than ${max} characters',
  'string.between': '${label} must be between ${low} and ${high} characters',
  'date.max': ({ label, max }) =>
    `${label} must not be after ${max.getTime ? max.toISOString() : max}`,
  'number.max': '${label} must be no more than ${max}',
  'array.max': '${label} must have no more than ${max} items',
  'array.between': '${label} must have between ${low} and ${high} items',
  'string.min': '${label} must not be shorter than ${min} characters',
  'date.min': ({ label, min }) =>
    `${label} must be after ${min.getTime ? min.toISOString() : min}`,
  'array.min': '${label} must have at least ${min} items',
  'number.min': '${label} must be no less than ${min}',
  unique: '${label} must only contain unique elements',
  email: '${label} must be a valid e-mail address',
};

const mergeDefault = (map) => ({
  ...defaultMessages,
  ...(map || {}),
});

const messageForError = (error, messages) => {
  const message =
    error.message ||
    messages[`${error.schema}.${error.type}`] ||
    messages[`${error.type}`] ||
    messages['default'];
  return typeof message === 'function'
    ? message(error.params)
    : interpolate(message, error.params);
};

export default (messages, errors) => {
  // return an object where the keys are paths and the values are arrays always
};
