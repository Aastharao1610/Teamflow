export const AppError = (message: string, statusCode = 500) => {
  const error = new Error(message) as any;

  error.statusCode = statusCode;
  error.isOperational = true;

  return error;
};