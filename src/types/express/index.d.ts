import { JwtPayload } from "jsonwebtoken";

declare namespace Express {
  export interface Request {
    user?: JwtPayload & {
      role?: string;
      _id?: string;
    };
  }
}
