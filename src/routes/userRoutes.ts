import { Router } from 'express';
import { check } from 'express-validator';
import { limiter } from '../helpers/rateLimit ';
import { validateFields } from '../middlewares/validateFields';
import { validateJWT } from '../middlewares/authMiddleware';
// controllers
import user from '../controllers/userController';

const router = Router();

router.get('/users/', [limiter, validateJWT], user.usersGet);

router.get('/users/:id', [limiter, validateJWT], user.userGet);

router.patch(
  '/users/:id',
  [
    limiter,
    validateJWT,
    check('first_name', 'First Name is required').notEmpty(),
    check('last_name', 'Last Name is required').notEmpty(),
    check('profile_image', 'Image is required').isEmpty(),
    validateFields,
  ],
  user.userPatch
);

router.delete('/users/:id', [limiter, validateJWT], user.userDelete);

export default router;
