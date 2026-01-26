import { Response } from 'express';

const sendResponse = <T>(
  res: Response,
  data: {
    success: boolean;
    statusCode: number;
    message?: string;
    data: T;
    meta?: Record<string, unknown> | null;
    totalPoints?: number; // Add totalPoints as an optional property
  },
) => {
  const responseBody: Record<string, unknown> = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta,
    data: data.data,
  };

  // Conditionally add totalPoints if it exists
  if (typeof data.totalPoints !== 'undefined') {
    responseBody.totalPoints = data.totalPoints;
  }

  res.status(data.statusCode).json(responseBody);
};

export default sendResponse;
