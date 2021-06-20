const SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g;
const CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/; // utility to dynamically destructure arrays

export const parts = (path) =>
  path.match(SPLIT_REGEX).map((p) => p.replace(CLEAN_QUOTES_REGEX, '$2'));

export const get = (obj, path, def) =>
  parts(path).reduce((acc, part) => (!acc ? acc : acc[part]), obj) ?? def;
