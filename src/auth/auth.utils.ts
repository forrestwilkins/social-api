import { verify } from "jsonwebtoken";

interface RequestWithCookies extends Request {
  cookies?: {
    auth: {
      access_token: string;
    };
  };
}

export const getClaims = (req: RequestWithCookies) => {
  if (!req.cookies?.auth) {
    return null;
  }
  const { access_token } = req.cookies.auth;
  const decoded = verify(access_token, process.env.JWT_KEY);
  return decoded;
};
