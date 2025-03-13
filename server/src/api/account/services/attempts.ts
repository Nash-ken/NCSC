// src/api/account/services/failedAttempts.ts

export const MAX_ATTEMPTS = 5;
export const LOCKOUT_TIME = 10 * 1000; // 10 seconds

const failedAttempts: Record<string, { count: number; lockUntil: number }> = {};

export default {
  getFailedAttempts(identifier: string) {
    return failedAttempts[identifier] || { count: 0, lockUntil: 0 };
  },

  resetFailedAttempts(identifier: string) {
    delete failedAttempts[identifier];
  },

  incrementFailedAttempts(identifier: string) {
    if (!failedAttempts[identifier]) {
      failedAttempts[identifier] = { count: 1, lockUntil: 0 };
    } else {
      failedAttempts[identifier].count++;
    }
  },

  checkLockout(identifier: string) {
    const userAttempts = failedAttempts[identifier];
    if (!userAttempts) return { locked: false, count: 0 };

    const { count, lockUntil } = userAttempts;

    if (lockUntil && lockUntil < Date.now()) {
      this.resetFailedAttempts(identifier);
      return { locked: false, count: 0 };
    }

    return lockUntil > Date.now() ? { locked: true } : { locked: false, count };
  },

  applyLockout(identifier: string) {
    if (!failedAttempts[identifier]) return;
    failedAttempts[identifier].lockUntil = Date.now() + LOCKOUT_TIME;
  },
};
