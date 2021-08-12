class ValidationError extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
  }
}

export default ValidationError;
