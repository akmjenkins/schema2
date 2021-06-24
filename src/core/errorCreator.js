// createError passed into the validator allows us to overwrite everything
// message can be a string or an object
export default ({ type, label, schema, params, error = {} }) => {
  const supplied = typeof error === 'string' ? { message: error } : error;
  // error is the user supplied error on the individual test
  const initial = {
    type,
    ...supplied,
    params: {
      ...(supplied.params || {}),
      // label schema and subject can NOT be overwritten in the error message...
      label,
      schema: schema.type,
      ...params,
    },
  };

  return (message = {}) => {
    const inner = typeof message === 'string' ? { message } : message;

    return {
      ...initial,
      ...inner,
      params: {
        // ...but they can in the userland test
        ...initial.params,
        ...(inner.params || {}),
      },
    };
  };
};
