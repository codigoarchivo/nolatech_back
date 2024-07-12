import { Router } from 'express';
import { check } from 'express-validator';
import userImageCloudinary from '../controllers/uploadController';
import { validateJWT } from '../middlewares/authMiddleware';
import { validateFields } from '../middlewares/validateFields';
import { limiter } from '../helpers/rateLimit ';

const router = Router();

// Path to upload profile image
router.put(
  '/upload/',
  [
    limiter,
    validateJWT,
    check('profile_image'),
    validateFields,
  ],
  userImageCloudinary // Driver to upload image to Cloudinary
);

export default router;
