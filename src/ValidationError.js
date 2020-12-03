const count = (num) =>
  `${num} error${num === 1 ? '' : 's'} occurred during validation`;

class ValidationError {
  constructor(errors, root = true) {
    if (root) {
      this.path = undefined;
      const all = errors.reduce((acc, [, es]) => [...acc, ...es], []);
      this.message = all.length > 1 ? count(all.length) : all[0];
      if (!errors[0][0]) {
        this.errors = errors[0][1];
      } else {
        this.errors = errors.map((e) => new ValidationError([e], false));
      }
    } else {
      this.path = errors[0][0];
      this.message =
        errors[0][1].length > 1 ? count(errors[0][1].length) : errors[0][1][0];
      this.errors = errors[0][1];
    }
  }
}

export default ValidationError;
