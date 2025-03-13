import { factories } from '@strapi/strapi';
import { MAX_ATTEMPTS } from '../services/attempts'; // Import the service constants

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    const attemptsService = strapi.service('api::account.attempts');

    // Check if identifier or password is missing
    if (!identifier || !password) {
      await strapi.service("api::log.create").createLogEntry({
        type: "Login Attempt",
        result: "Failure",
        identifier,
        date: new Date(),
        ipv4: ctx.request.ip,
        reason: "Missing credentials",
        agent: ctx.request.headers["user-agent"] || null,
        role: null,  // No role for failed login due to missing credentials
      });

      return ctx.badRequest("Missing credentials");
    }

    // Check for lockout
    const lockoutStatus = attemptsService.checkLockout(identifier);
    if (lockoutStatus?.locked) {
      await strapi.service("api::log.create").createLogEntry({
        type: "Login Attempt",
        result: "Failure",
        identifier,
        date: new Date(),
        ipv4: ctx.request.ip,
        reason: "Account locked due to failed attempts",
        agent: ctx.request.headers["user-agent"] || null,
        role: null,  // No role if locked
      });

      return ctx.tooManyRequests("Too many failed attempts. Try again later.");
    }

    // Fetch the user by email or username
    const foundUser = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { email: identifier },
      populate: { role: true }, // Ensure role is populated in the query
    });

    if (!foundUser) {
      attemptsService.incrementFailedAttempts(identifier);

      await strapi.service("api::log.create").createLogEntry({
        type: "Login Attempt",
        result: "Failure",
        identifier,
        date: new Date(),
        ipv4: ctx.request.ip,
        reason: "User not found",
        agent: ctx.request.headers["user-agent"] || null,
        role: "Unknown",  // No role if user is not found
      });

      return ctx.unauthorized("Invalid credentials");
    }

    // Fetch the role name
    const role = foundUser.role ? foundUser.role.name : null;

    // Validate the password
    const validPassword = await strapi.plugins["users-permissions"].services.user.validatePassword(
      password,
      foundUser.password
    );

    if (!validPassword) {
      attemptsService.incrementFailedAttempts(identifier);

      const failedAttempts = attemptsService.getFailedAttempts(identifier);
      if (failedAttempts.count >= MAX_ATTEMPTS) {
        attemptsService.applyLockout(identifier);

        await strapi.service("api::log.create").createLogEntry({
          type: "Login Attempt",
          result: "Failure",
          identifier,
          date: new Date(),
          ipv4: ctx.request.ip,
          reason: `Account locked after ${failedAttempts.count} failed attempts`,
          agent: ctx.request.headers["user-agent"] || null,
          role,  // Include the role name even on lockout
        });

        return ctx.tooManyRequests("Account temporarily locked due to multiple failed login attempts.");
      }

      await strapi.service("api::log.create").createLogEntry({
        type: "Login Attempt",
        result: "Failure",
        identifier,
        date: new Date(),
        ipv4: ctx.request.ip,
        reason: "Invalid credentials",
        agent: ctx.request.headers["user-agent"] || null,
        role,  // Include the role name on failed login
      });

      return ctx.unauthorized("Invalid credentials");
    }

    attemptsService.resetFailedAttempts(identifier); // Reset failed attempts on successful login

    await strapi.service("api::log.create").createLogEntry({
      type: "Login Attempt",
      result: "Success",
      identifier,
      date: new Date(),
      ipv4: ctx.request.ip,
      reason: null,  // No failure reason
      agent: ctx.request.headers["user-agent"] || null,
      role,  // Include the role name on successful login
    });

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
      id: foundUser.id,
    });

    return ctx.send({
      jwt,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        confirmed: foundUser.confirmed,
        blocked: foundUser.blocked,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
        role,  // Include the role name in the response
      },
    });
  },
}));
