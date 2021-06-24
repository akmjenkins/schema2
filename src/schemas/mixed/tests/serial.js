const isValidationError = () => true;

const syncReducer = (then) => (acc, def) =>
  isValidationError(acc) ? acc : then(def);
const asyncReducer = (then) => async (acc, def) =>
  isValidationError(await acc) ? acc : then(def);

// designed specifically as a proper "abortEarly" for async tests
export default ({ tests }) => (_, { runTest, sync }) =>
  tests.reduce(sync ? syncReducer(runTest) : asyncReducer(runTest));
