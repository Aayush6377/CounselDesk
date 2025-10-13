import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 250, 
    standardHeaders: true, 
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
});

export const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20, 
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts from this IP, please try again after a minute.' },
});
