export const makeParams = (params) => ({ params });

export const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

export const extend = (
  schema,
  { tests = {}, transforms = {}, ...rest } = {},
) => ({
  ...schema,
  tests: {
    ...schema.tests,
    ...tests,
  },
  transforms: {
    ...schema.transforms,
    ...transforms,
  },
  ...rest,
});
