
import jwt, { JwtPayload } from 'jsonwebtoken';
import { MyJwtPayload } from './auth.types';

export const createToken = (
  jwtPayload: MyJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string): MyJwtPayload => {
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === "string") {
    throw new Error("Invalid token format");
  }
  return decoded as MyJwtPayload;
};

