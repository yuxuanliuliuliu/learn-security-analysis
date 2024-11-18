import rateLimit from "express-rate-limit";

export const appRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});