const passed = (v) => v === true;

const syncReducer = (then) => (acc, def) => passed(acc) ? then(def) : acc;
const asyncReducer = (then) => async (acc, def) =>
  passed(await acc) ? then(def) : acc;

// designed specifically as a proper "abortEarly" for async tests
export default ({ tests }) =>
  (_, { runTest, sync }) =>
    tests.reduce(sync ? syncReducer(runTest) : asyncReducer(runTest));
