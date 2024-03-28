const throwTechError = (error, next) => {
  const err = new Error(error);
  err.httpStatusCode = 500;
  return next(err);
}

export default throwTechError