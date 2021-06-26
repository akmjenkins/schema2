import ValidationError from './ValidationError';
import check from './check';

export const settle = (schema, value, options) => {
  const { sync, assert, abortEarly, multiple } = options;
  const { value: finalValue, results } = check(schema, value, options);

  const done = (errors = []) => {
    if (errors.length) throw new ValidationError(errors);
    return finalValue;
  };

  // early return if we aren't validating, or are validating sync, or if there are no errors
  if (!assert || sync || !results.length) {
    const then = done(results);
    return sync ? then : Promise.resolve(then);
  }

  // when abortEarly is true...
  if (abortEarly) {
    // ... if multiple is true...
    if (multiple) {
      // we have to wait for all results from at least one key that has at least one error
      // there is virtually never a circumstance where abortEarly: true, and multiple: true makes sense in the real world
      return Promise.all(
        results.map(async ([key, r]) => {
          const resultsForKey = await Promise.all(r).then((e) =>
            e.filter((r) => r !== true),
          );
          if (resultsForKey.length) done([[key, resultsForKey]]);
        }),
      ).then(done);
    }

    // when multiple is false, we simply reject on the first error
    return Promise.all(
      results.map(([key, r]) =>
        Promise.all(
          r.map(async (w) => {
            const resultForKey = await w;
            resultForKey !== true && done([[key, [resultForKey]]]);
          }),
        ),
      ),
    ).then(done);
  }

  // if abortEarly is false...

  // and multiple is true ...
  if (multiple) {
    // we simply have to wait for all results
    return Promise.all(
      results.map(([key, r]) =>
        Promise.all(r).then((e) => {
          const messages = e.filter((f) => f !== true);
          return messages.length ? [[key, messages]] : undefined;
        }),
      ),
    ).then((r) => done(r.filter((f) => !!f)));
  }

  // we can go slightly faster when multiple is false, because we can reject when
  // each key has either resolved all their results, or has at least one error (no need to wait for a second error)
  return Promise.all(
    results.map(([key, r]) => {
      return new Promise((innerRes) => {
        Promise.all(
          r.map(async (w) => {
            const result = await w;
            return result !== true ? innerRes([[key, [result]]]) : undefined;
          }),
        ).then(innerRes);
      });
    }),
  ).then((r) => done(r.filter((f) => !!f)));
};

export default settle;
