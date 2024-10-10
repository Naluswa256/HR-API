import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { SECRET_KEY } from '.';
import { tokenTypes } from '@/interfaces/token.interface';
import { ApiError } from '@/utils/apiError';
import httpStatus from 'http-status';
import { IEmployeeDocument } from '@/models/users.model';
import usersService from '@/services/users.service';


const jwtOptions = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};


const jwtVerify = async (payload: any, done: VerifiedCallback) => {
  try {

    if (payload.type !== tokenTypes.ACCESS) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
    }

    const user: IEmployeeDocument = await usersService.findUserByEmployeeId(payload.sub);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
};
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
