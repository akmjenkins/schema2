import { filteredWithWhere } from '../utils';

export default ({ values, where, path }) =>
  (value, { is, resolve }) =>
    filteredWithWhere({ values, where, path }, { is, resolve }, value, true)
      .subject;
