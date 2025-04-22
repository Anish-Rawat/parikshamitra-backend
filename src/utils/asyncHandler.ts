import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
  (requestHandler: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await requestHandler(req, res, next);
    } catch (err: any) {
      const statusCode =
        typeof err.code === "number" && err.code >= 100 && err.code < 600
          ? err.code
          : 500;

      res.status(statusCode).json({
        success: false,
        message: err.message ?? "Something went wrong",
      });
    }
  };
