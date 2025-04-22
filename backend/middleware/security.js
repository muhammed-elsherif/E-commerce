const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Rate limiting to prevent DDoS attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// SQL Injection protection middleware
const sqlInjectionProtection = (req, res, next) => {
    const sqlKeywords = [
        'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', 'JOIN',
        'WHERE', 'OR', 'AND', 'EXEC', 'EXECUTE', 'DECLARE', 'TRUNCATE'
    ];

    const checkForSqlInjection = (obj) => {
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    const value = obj[key].toUpperCase();
                    if (sqlKeywords.some(keyword => value.includes(keyword))) {
                        return true;
                    }
                } else if (typeof obj[key] === 'object') {
                    if (checkForSqlInjection(obj[key])) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    if (checkForSqlInjection(req.body) || checkForSqlInjection(req.query) || checkForSqlInjection(req.params)) {
        return res.status(400).json({
            success: false,
            message: 'Potential SQL injection detected'
        });
    }

    next();
};

// Request size limiting middleware
const requestSizeLimiter = (req, res, next) => {
    const contentLength = req.headers['content-length'];
    if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB limit
        return res.status(413).json({
            success: false,
            message: 'Request entity too large'
        });
    }
    next();
};

// Security headers middleware
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    expectCt: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: true,
    xssFilter: true
});

module.exports = {
    limiter,
    sqlInjectionProtection,
    requestSizeLimiter,
    securityHeaders,
    xss,
    mongoSanitize,
    hpp
}; 