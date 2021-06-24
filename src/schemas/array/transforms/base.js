export default () => (val) => {
  if (typeof val === 'string')
    try {
      val = JSON.parse(val);
    } catch (err) {
      val = null;
    }

  return Array.isArray(val) ? val : null;
};
