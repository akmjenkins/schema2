export default (...schemaDefs) =>
  schemaDefs.reduce(
    (
      acc,
      {
        tests = [],
        transforms = [],
        conditions = [],
        nullable,
        default: def,
        label,
        ...rest
      } = {},
    ) => ({
      type: 'mixed',
      ...acc,
      ...rest,
      conditions: [...(acc.conditions || []), ...conditions],
      transforms: [...(acc.transforms || []), ...transforms],
      tests: [...(acc.tests || []), ...tests],
      nullable: typeof nullable === 'undefined' ? acc.nullable : nullable,
      default: typeof def === 'undefined' ? acc.default : def,
      label: typeof label === 'undefined' ? acc.label : label,
    }),
  );
