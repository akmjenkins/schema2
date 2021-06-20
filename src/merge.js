const mergeInners = (how, ...inners) =>
  inners.reduce(
    (acc, i = {}) =>
      // merge the schema definitions at the keys
      Object.entries(i).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: acc[k] ? how(acc[k], v) : v }),
        acc,
      ),
    {},
  );

const mergeDefs = (...schemaDefs) =>
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
      type: 'mixed',
      ...acc,
      ...rest,
      inner:
        acc.inner || inner
          ? mergeInners(mergeDefs, inner, acc.inner)
          : undefined,
      conditions: [...(acc.conditions || []), ...conditions],
      transforms: [...(acc.transforms || []), ...transforms],
      tests: [...(acc.tests || []), ...tests],
      nullable: nullable === undefined ? acc.nullable : nullable,
      label: label === undefined ? acc.label : label,
    }),
    {},
  );

export default mergeDefs;
