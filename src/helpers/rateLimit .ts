import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Maximum 20 requests per IP
  message: 'Too many requests from this IP, try again later.',
});
