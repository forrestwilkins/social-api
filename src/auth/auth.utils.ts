import { JwtPayload, verify } from "jsonwebtoken";
import { AuthTokens } from "./auth.service";

interface Claims {
  accessTokenClaims: JwtPayload | null;
  refreshTokenClaims: JwtPayload | null;
}

interface RequestWithCookies extends Request {
  cookies?: { auth?: AuthTokens };
}

export const getSub = ({ accessTokenClaims, refreshTokenClaims }: Claims) => {
  if (accessTokenClaims?.sub) {
    return parseInt(accessTokenClaims.sub);
  }
  if (refreshTokenClaims?.sub) {
    return parseInt(refreshTokenClaims.sub);
  }
  return null;
};

export const getClaims = (req: RequestWithCookies): Claims => {
  const { cookies } = req;
  const accessTokenClaims = cookies?.auth
    ? decodeToken(cookies.auth.access_token)
    : null;
  const refreshTokenClaims = cookies?.auth
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
