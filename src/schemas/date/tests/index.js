import min from './min';
import max from './max';
import future from './future';
import past from './past';
import between from './between';

export default (...args) =>
  [min, max, future, past, between].reduce(
    (acc, f) => ({ ...acc, [f.name]: f(...args) }),
    {},
  );
