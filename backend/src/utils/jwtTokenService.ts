import jwt from 'jsonwebtoken';
const SECRET = 'MYSUPERSECRETKEY';
export const JwtTokenService = {
  generate<T extends string | object | Buffer>(payload: T): string {
    return jwt.sign(payload, SECRET, {
      expiresIn: '2h',
      issuer: 'moolaga.net',
    });
  },
  decode(token: string) {
    const jwtPayload = jwt.decode(token);
    return jwtPayload;
  },
  validate(token: string) {
    try {
      jwt.verify(token, SECRET);
    } catch (error) {
      throw error;
    }
  },
};
