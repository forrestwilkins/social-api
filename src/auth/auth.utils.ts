import { JwtPayload, verify } from "jsonwebtoken";

interface RequestWithCookies extends Request {
  cookies?: {
    auth: {
      access_token: string;
    };
  };
}

export const getClaims = (req: RequestWithCookies) => {
  if (!req.cookies?.auth) {
    return;
  }
  try {
    const { access_token } = req.cookies.auth;
    const jwtKey = process.env.JWT_KEY as string;
    return verify(access_token, jwtKey) as JwtPayload;
  } catch {
    return;
  }
};
