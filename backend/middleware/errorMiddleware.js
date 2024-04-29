const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  //  Check for mongoose badObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Invalid ObjectId";
    statusCode = 400;
  }

  res.status(statusCode);
  res.json({
    error: message,
    stack: process.env.NODE_ENV === "production" ? "🥮" : err.stack,
  });
};

export { notFound, errorHandler };
