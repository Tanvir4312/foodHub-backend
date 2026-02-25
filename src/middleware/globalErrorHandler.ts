import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = err.message || "Internal server error!!";


  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      ((statusCode = 404), (errorMessage = err.message || "not found"));
    }
    if (err.code === "P2002") {
      ((statusCode = 400), (errorMessage = err.message || "Duplicate!!"));
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    ((statusCode = 400), (errorMessage = "creation failed"));
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
   
  });
}

export default errorHandler;
