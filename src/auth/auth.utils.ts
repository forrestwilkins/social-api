import { JwtPayload, verify } from "jsonwebtoken";
import { AuthTokens } from "./auth.service";

interface RequestWithCookies extends Request {
  cookies?: { auth: AuthTokens };
}

export const getClaims = (req: RequestWithCookies) => {
  const { cookies } = req;
  const accessTokenClaims = cookies
    ? decodeToken(cookies.auth.access_token)
    : null;
  const refreshTokenClaims = cookies
    ? decodeToken(cookies.auth.refresh_token)
    : null;
  return { accessTokenClaims, refreshTokenClaims };
};

export const decodeToken = (token: string) => {
  try {
    const jwtKey = process.env.JWT_KEY as string;
    return verify(token, jwtKey) as JwtPayload;
  } catch {
    return null;
  }
};
