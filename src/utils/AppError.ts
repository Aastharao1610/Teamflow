export type AppErrorType = Error & {
  statusCode: number;
  isOperational: boolean;
};

export const AppError = (
  message: string,
  statusCode = 500
): AppErrorType => {
  const error = new Error(message) as AppErrorType;

  error.statusCode = statusCode;
  error.isOperational = true;

  return error;
};