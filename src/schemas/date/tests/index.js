import min from './min';
import max from './max';
import future from './future';
import past from './past';
import between from './between';
import typeCheck from './typeCheck';

export default (...args) =>
  [min, max, future, past, typeCheck, between].reduce(
    (acc, f) => ({
      ...acc,
      [f.name]: f(...args),
    }),
    {},
  );
