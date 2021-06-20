const trimStart = /^(\s+)?/;
const trimEnd = /(\s+)?$/;

export default ({ start = true, end = true } = {}) => (v) => {
  if (!v) return v;
  return start && end ? v.trim() : v.replace(start ? trimStart : trimEnd, '');
};
