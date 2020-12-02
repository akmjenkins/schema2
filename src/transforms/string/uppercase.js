import { createTransform } from '../../utils';

const transform = (v) => (v ? v.toUpperCase() : v);

export default createTransform(() => transform, { allowSchemas: ['string'] });

// const replace = (regexp, substitution) => (v) =>
//   v && v.replace(regexp, substitution);
// const strip = () => replace(/\s/g, '');

// const trimStart = /^(\s+)?/;
// const trimEnd = /(\s+)?$/;

// const trim = ({ start = true, end = true } = {}) => (v) => {
//   if (!v) return v;
//   return start && end ? v.trim() : v.replace(start ? trimStart : trimEnd, '');
// };

// const uppercase = () => (v) => v.toUpperCase();
// const lowercase = () => (v) => v.toUpperCase();
