// services/failedAttemptsService.ts

export const MAX_ATTEMPTS = 5;
export const LOCKOUT_TIME = 10 * 1000; // 10 seconds

export const failedAttempts: Record<string, { count: number; lockUntil: number }> = {};

export const getFailedAttempts = (identifier: string) => failedAttempts[identifier];

export const resetFailedAttempts = (identifier: string) => {
  delete failedAttempts[identifier];
};

export const incrementFailedAttempts = (identifier: string) => {
  if (!failedAttempts[identifier]) {
    failedAttempts[identifier] = { count: 1, lockUntil: 0 };
  } else {
    failedAttempts[identifier].count++;
  }
};

export const checkLockout = (identifier: string) => {
  const userAttempts = failedAttempts[identifier];
  if (!userAttempts) return null; // No failed attempts yet
  const { count, lockUntil } = userAttempts;

  if (lockUntil && lockUntil < Date.now()) {
    resetFailedAttempts(identifier); // Reset after lockout period
  }

  return lockUntil > Date.now() ? { locked: true } : { locked: false, count };
};

export const applyLockout = (identifier: string) => {
  failedAttempts[identifier].lockUntil = Date.now() + LOCKOUT_TIME;
};
