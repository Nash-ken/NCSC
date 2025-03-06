import { factories } from "@strapi/strapi";
import { getFailedAttempts, resetFailedAttempts, incrementFailedAttempts, checkLockout, applyLockout, MAX_ATTEMPTS } from '../services/failedAttempts';

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  // Override the default login method
  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    if (!identifier || !password) {
      return ctx.badRequest("Missing credentials");
    }

    // Check for lockout status
    const lockoutStatus = checkLockout(identifier);
    if (lockoutStatus?.locked) {
      return ctx.tooManyRequests("Too many failed attempts. Try again later.");
    }

    try {
      // Fetch the user by email using Strapi's entityService
      const users = await strapi.entityService.findMany("plugin::users-permissions.user", {
        filters: { email: identifier },
      });

      if (!users || users.length === 0) {
        throw new Error("User not found");
      }

      const foundUser = users[0];

      // Validate password using Strapi's built-in function
      const validPassword = await strapi.plugins["users-permissions"].services.user.validatePassword(
        password,
        foundUser.password
      );

      if (!validPassword) {
        throw new Error("Invalid credentials");
      }

      // Reset failed attempts on successful login
      resetFailedAttempts(identifier);

      // Generate JWT token
      const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: foundUser.id,
      });

      return ctx.send({
        jwt,
        user: {
          id: foundUser.id,
          documentId: foundUser.documentId,
          username: foundUser.username,
          email: foundUser.email,
          provider: foundUser.provider,
          confirmed: foundUser.confirmed,
          blocked: foundUser.blocked,
          createdAt: foundUser.createdAt,
          updatedAt: foundUser.updatedAt,
          publishedAt: foundUser.publishedAt
        }
      });
    } catch (error) {
      // Increment failed attempts
      incrementFailedAttempts(identifier);

      const failedAttempts = getFailedAttempts(identifier);
      if (failedAttempts.count >= MAX_ATTEMPTS) {
        // Lock the account for the defined time (10 seconds)
        applyLockout(identifier);
        return ctx.tooManyRequests("Account temporarily locked due to multiple failed login attempts.");
      }

      return ctx.unauthorized("Invalid credentials");
    }
  },
}));
