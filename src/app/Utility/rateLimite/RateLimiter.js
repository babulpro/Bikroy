// src/app/Utility/rateLimite/RateLimiter.js
export class RateLimiter {
    constructor() {
        this.store = new Map();
    }
    
    isAllowed(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        const now = Date.now();
        const attempts = this.store.get(key) || [];
        const validAttempts = attempts.filter(time => now - time < windowMs);
        
        if (validAttempts.length >= maxAttempts) {
            return false;
        }
        
        validAttempts.push(now);
        this.store.set(key, validAttempts);
        
        setTimeout(() => {
            const current = this.store.get(key);
            if (current && current.length === validAttempts.length) {
                this.store.delete(key);
            }
        }, windowMs);
        
        return true;
    }
    
    clear(key) {
        this.store.delete(key);
    }
}