const trimStart = /^(\s+)?/;
const trimEnd = /(\s+)?$/;

export default ({ start = true, end = true }) =>
  (v) => {
    if (start && end) return v.trim();
    return v.replace(start ? trimStart : trimEnd, '');
  };
