import jwt, { JwtPayload } from 'jsonwebtoken';

interface ISignToken {
  id?: number | undefined;
  email?: string;
  expiresIn?: string | number;
}

const signToken = (props: ISignToken): string => {
  const { id = '', email = '', expiresIn, ...user } = props;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('No JWT secret provided');
  }

  return jwt.sign({...user, id, email }, jwtSecret, { expiresIn });
};

interface IInfoToken extends ISignToken {
  first_name: string;
  last_name: string;
  profile_image: string | null;
  is_admin: boolean | undefined;
}

const infoToken = (props: IInfoToken) => {
  if (!props) {
    throw new Error('Incomplete data to generate tokens');
  }
  // Genera tokens JWT
  const accessToken = signToken({ ...props, expiresIn: '1m' });
  const refreshToken = signToken({ ...props, expiresIn: '5d' });

  return {
    accessToken,
    refreshToken,
  };
};

const verifyToken = (token: string): Promise<JwtPayload> => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return Promise.reject('No JWT secret provided');
  }

  if (!token) {
    return Promise.reject('JWT token is empty');
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret) as JwtPayload;
    return Promise.resolve(decodedToken);
  } catch (error) {
    return Promise.reject('Invalid JWT token');
  }
};

export default {
  signToken,
  infoToken,
  verifyToken,
};
