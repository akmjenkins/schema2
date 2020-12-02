import { createTypeCheck } from '../utils';

const stringTransform = () => (v) => v.toString();
const stringTypeCheck = createTypeCheck((v) => typeof v === 'string');

export const schema = {
  transforms: ['stringTransform'],
  tests: ['stringTypeCheck'],
};

export const tests = { stringTypeCheck };

const replace = (regexp, substitution) => (v) =>
  v && v.replace(regexp, substitution);
const strip = () => replace(/\s/g, '');

const trimStart = /^(\s+)?/;
const trimEnd = /(\s+)?$/;

const trim = ({ start = true, end = true } = {}) => (v) => {
  if (!v) return v;
  return start && end ? v.trim() : v.replace(start ? trimStart : trimEnd, '');
};

const uppercase = () => (v) => v.toUpperCase();
const lowercase = () => (v) => v.toUpperCase();

export const transforms = {
  stringTransform,
  // trim: restrictOperatorToSchema(['string'], trim),
  // strip: restrictOperatorToSchema(['string'], strip),
  // replace: restrictOperatorToSchema(['string'], replace),
  // uppercase: restrictOperatorToSchema(['string'], uppercase),
  // lowercase: restrictOperatorToSchema(['string'], lowercase),
};
