const DEFAULT_MERGE = (schemas) => Object.assign({}, ...schemas);

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
        ...rest
      } = {},
    ) => ({
      ...(acc.merge || DEFAULT_MERGE)([acc, rest], mergeSchemaDefinitions),
      conditions: [...acc.conditions, ...conditions],
      transforms: [...acc.transforms, ...transforms],
      tests: [...acc.tests, ...tests],
      nullable: nullable ?? acc.nullable,
      label: label ?? acc.label,
    }),
    { tests: [], transforms: [], conditions: [] },
  );

export default mergeSchemaDefinitions;
