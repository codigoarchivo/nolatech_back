import { Router } from 'express';
import { check } from 'express-validator';
import auth from '../controllers/authController';
import validatePassword from '../helpers/validatePassword';
import { validateFields } from '../middlewares/validateFields';
import { limiter } from '../helpers/rateLimit ';
import { validateToken } from '../helpers/validateToken';

const router = Router();

router.post(
  '/users',
  [
    limiter,
    check('first_name', 'First Name is required').notEmpty(),
    check('last_name', 'Last Name is required').notEmpty(),
    check('email', 'Email is required').notEmpty().isEmail(),
    check('password', {
      titulo: 'Your password must have:',
      message1: 'minimum 8 characters long.',
      message2: 'At least one capital letter.',
      message3: 'At least one lowercase.',
      message4: 'At least one number.',
      message5: 'At least one special character.',
    })
      .notEmpty()
      .trim()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      })

      .custom(validatePassword.validatePassword),
    check('password_repeat').custom(validatePassword.validatePasswordRepeat),
    validateFields,
  ],
  auth.createUser
);

router.post(
  '/jwt/create/',
  [
    limiter,
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required')
      .notEmpty()
      .trim()
      .custom(validatePassword.passwordCompare),
    validateFields,
  ],
  auth.loginUser
);

router.post(
  '/users/activation/',
  [
    limiter,
    check('token', 'Token is required')
      .notEmpty()
      .isJWT()
      .custom(validateToken),
    validateFields,
  ],
  auth.activation
);

router.post(
  '/jwt/refresh/',
  [
    check('token', 'Token is required')
      .notEmpty()
      .isJWT()
      .custom(validateToken),
    validateFields,
  ],
  auth.refreshTokens
);

export default router;
