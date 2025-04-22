export const sendResponse = (
  res: any,
  statusCode: number,
  success: boolean,
  message: string,
  data?: any
) => {
  return res.status(statusCode).json({ success, message, data });
};
