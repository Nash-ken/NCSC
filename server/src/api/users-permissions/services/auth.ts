import { factories } from "@strapi/strapi";

const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "3", 10);
const LOCK_TIME = parseInt(process.env.LOCK_TIME || "15", 10) * 60 * 1000; // Default to 15 mins

export default factories.createCoreService('plugin::users-permissions.user', ({ strapi }) => {
  const userQuery = strapi.db.query('plugin::users-permissions.user');

  return {
    /**
     * Check login attempts and whether the user is locked out
     */
    async checkLoginAttempts(userId: number): Promise<boolean> {
      const user = await userQuery.findOne({
        where: { id: userId },
        select: ['loginAttempts', 'lastFailedAttempt'],
      });

      if (!user) {
        console.log("User not found.");
        return false;
      }

      const { loginAttempts, lastFailedAttempt } = user;
      console.log(`Login Attempts: ${loginAttempts}`);
      console.log(`Last Failed Attempt: ${lastFailedAttempt}`);

      // If login attempts exceed the limit and lock time hasn't expired
      if (loginAttempts >= MAX_LOGIN_ATTEMPTS && lastFailedAttempt) {
        const lastAttemptTime = new Date(lastFailedAttempt).getTime();
        const now = Date.now();

        if (!isNaN(lastAttemptTime)) {
          const timeSinceLastAttempt = now - lastAttemptTime;
          console.log(`Time since last attempt: ${timeSinceLastAttempt}ms`);

          if (timeSinceLastAttempt < LOCK_TIME) {
            // Account is locked
            console.log("User is locked out.");
            return true;
          }

          // Lock expired — reset attempts and last failed attempt
          await userQuery.update({
            where: { id: userId },
            data: { loginAttempts: 0, lastFailedAttempt: null },
          });
          console.log("Lock expired. Login attempts reset.");
        } else {
          console.log("Invalid lastFailedAttempt date.");
        }
      }

      return false;
    },

    /**
     * Increment login attempts and handle lock
     */
    async incrementLoginAttempts(userId: number): Promise<void> {
      const user = await userQuery.findOne({
        where: { id: userId },
        select: ['loginAttempts'],
      });

      const newAttempts = (user?.loginAttempts || 0) + 1;

      // Update login attempts and last failed attempt in a single query
      await userQuery.update({
        where: { id: userId },
        data: {
          loginAttempts: newAttempts,
          lastFailedAttempt: new Date().toISOString(),
        },
      });

      console.log(`Incremented login attempts for user ${userId} to ${newAttempts}`);
    },

    /**
     * Reset login attempts after a successful login
     */
    async resetLoginAttempts(userId: number): Promise<void> {
      // Reset login attempts and last failed attempt in a single query
      await userQuery.update({
        where: { id: userId },
        data: { loginAttempts: 0, lastFailedAttempt: null },
      });

      console.log(`Reset login attempts for user ${userId}`);
    },
  };
});
