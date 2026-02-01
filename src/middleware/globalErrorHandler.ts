import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Interval server error!!";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      ((statusCode = 400), (errorMessage = "User not found"));
    }
  }

  res.status(500);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default errorHandler;
