import { factories } from '@strapi/strapi';


export default factories.createCoreController('plugin::users-permissions.user', () => ({
  async generateResetPasswordToken(ctx) {
    const { email } = ctx.request.body;

    if (!email) {
        return ctx.badRequest('Email is required');
    }

    // Query the user by email
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: email },
        select: ['id'], // Ensure we are selecting the id column
    });

    if (!user) {
        return ctx.notFound('User not found');
    }

    // Generate the reset password token with user ID as the payload
    const resetPasswordToken = await strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    // Return the token in the response
    return ctx.send({
        message: 'Password reset token generated successfully.',
        token: resetPasswordToken,
    });
},


  async changePassword(ctx) {
    const { token, newPassword } = ctx.request.body;

    if (!token || !newPassword) {
        return ctx.badRequest('Token and new password are required');
    }

    let decoded;
    try {
        // Verify the token using the JWT service
        decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token);
       
    } catch (err) {
        // Catch and handle any error during token verification
        return ctx.badRequest('Invalid or expired token');
    }

    // Check if the decoded token contains the user ID
    if (!decoded || !decoded.id) {
        return ctx.badRequest('Invalid token data');
    }
    console.log(decoded)

    // Find the user by ID from the decoded token
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: decoded.id },
        select: ['id', 'email'], // Ensure we select necessary fields
    });

    if (!user) {
        return ctx.notFound('User not found');
    }

    const hashedPassword = await strapi.service('admin::auth').hashPassword(newPassword)

    // Update the user's password
    await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    return ctx.send({
        message: 'Password has been successfully changed.',
    });
}
}));
