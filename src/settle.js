import check from './check';
import ValidationError from './ValidationError';
import { hasSynchronousError, isThenable } from './utils';

const settle = (schema, value, options) => {
  const { sync, assert, abortEarly, multiple } = options;
  const { value: finalValue, results } = check(schema, value, options);

  const done = (errors = []) => {
    if (errors.length) throw new ValidationError(errors);
    return finalValue;
  };

  if (assert) {
    // validating, prepare to potentially throw something

    // things are done sync, we know what's what immediately
    if (sync) return done(results);

    // everything ran sync and returned no errors, also good to go!
    if (!results.length) return Promise.resolve(done());

    // if we've got a synchronous error and we can abortEarly, do so
    if (abortEarly && hasSynchronousError(results))
      return Promise.resolve(
        done(
          [
            results.find(([, errorOrPromise]) =>
              errorOrPromise.some((e) => !isThenable(e)),
            ),
          ].map(([path, errororPromise]) => [
            path,
            errororPromise.filter((e) => !isThenable(e)),
          ]),
        ),
      );

    // there are no synchronous errors, so we've got to wait until some results become available before we can decide what to do
    // exactly how long we have to wait depends on the options this was called with
    // we want to wait as short as possible before returning a result to the user

    // when abortEarly is true...
    if (abortEarly) {
      // ... and multiple is true...
      if (multiple) {
        // we have to wait for all results from at least one key that has at least one error
        // there is virtually never a circumstance where abortEarly: false, and multiple: true makes sense in the real world
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
              const result = await w;
              result !== true && done([key, result]);
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
            return messages.length ? [key, messages] : undefined;
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
              return result !== true ? innerRes([key, [result]]) : undefined;
            }),
          ).then(() => innerRes());
        });
      }),
    ).then((r) => done(r.filter((f) => !!f)));
  }

  return done();
};

export default settle;
