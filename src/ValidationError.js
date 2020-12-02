const count = (num) =>
  `${num} error${num === 1 ? '' : 's'} occurred during validation`;

class ValidationError extends Error {
  constructor(errors, multiple) {
    super();

    console.log(errors);
    // const inner = Object.entries(errors);

    // this.path = inner[0][0];

    // this.errors = inner[0][1];
    // this.message =
    //   this.errors.length === 1 ? this.errors[0] : count(this.errors.length);
    // this.inner = inner
    //   .slice(1)
    //   .map(([path, error]) => new ValidationError({ [path]: error }));

    // this.message = inner[1][1];
    // this.all = inner[1];

    // // errors is a map of paths to an array of errors
    // const count = Object.values(errors).reduce((acc, es) => {
    //   return acc + es.length;
    // }, 0);

    // console.log(count);

    // // this.errors = errors.reduce(
    // //   (acc, [path, err]) => ({
    // //     ...acc,
    // //     [path]: Array.from(new Set([...(acc[path] || []), err])),
    // //   }),
    // //   {},
    // // );

    // // const total = Object.values(this.errors).reduce(
    // //   (acc, v) => acc + v.length,
    // //   0,
    // // );

    // this.message = count === 1 ? `${count} error${
    //   count === 1 ? '' : 's'
    // } occurred during validation`;
  }
}

export default ValidationError;
