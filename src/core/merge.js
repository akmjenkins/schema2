const mergeInnerSchemas = (how, ...inners) => {
  // tuples can't be "merged" - the last one takes precedence
  if (inners.some(Array.isArray)) return inners.filter(Array.isArray).pop();

  // objects
  return inners.reduce(
    (acc, i = {}) =>
      // merge the schema definitions at the keys
      Object.entries(i).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: acc[k] ? how(acc[k], v) : v }),
        acc,
      ),
    {},
  );
};

const mergeSchemaDefinitions = (...schemaDefs) =>
  schemaDefs.reduce(
    (
      acc,
      {
        tests = [],
        transforms = [],
        conditions = [],
        nullable,
        label,
        inner,
        ...rest
      } = {},
    ) => ({
      ...acc,
      ...rest,
      inner:
        acc.inner || inner
          ? mergeInnerSchemas(mergeSchemaDefinitions, acc.inner, inner)
          : undefined,
      conditions: [...acc.conditions, ...conditions],
      transforms: [...acc.transforms, ...transforms],
      tests: [...acc.tests, ...tests],
      nullable: nullable ?? acc.nullable,
      label: label ?? acc.label,
    }),
    { tests: [], transforms: [], conditions: [] },
  );

export default mergeSchemaDefinitions;
