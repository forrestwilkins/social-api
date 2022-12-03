import { Secret, verify } from "jsonwebtoken";

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
  try {
    const { access_token } = req.cookies.auth;
    return verify(access_token, process.env.JWT_KEY as Secret);
  } catch {
    return null;
  }
};
