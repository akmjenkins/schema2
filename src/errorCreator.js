import { messageForError } from './messages';

export default (name, label, schema, options) => (opts = {}) => {
  const { messages } = options;

  opts =
    typeof opts === 'string' || typeof opts === 'function'
      ? { message: opts }
      : opts;

  const innerName = opts.name || name;
  const innerParams = {
    label,
    schema: schema.type,
    ...(opts.params || {}),
  };

  return messageForError(
    {
      message: opts.message,
      params: innerParams,
      schema: schema.type,
      type: innerName,
    },
    messages,
  );
};
