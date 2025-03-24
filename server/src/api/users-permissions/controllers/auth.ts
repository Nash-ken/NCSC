import { factories } from '@strapi/strapi';
import { Context } from 'koa';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default factories.createCoreController('plugin::users-permissions.user', ({strapi}) => ({
    async login(ctx: Context) {
        const { identifier, password } = ctx.request.body;

        const logData = {
          Type: 'Authentication',
          User: identifier,
          State: 'Success',
          Activity: `User Logged in`,
          Source: ctx.request.ip,
          Browser: ctx.request.headers['user-agent']
        };
       
    
        if (!identifier || !password) {
          return ctx.badRequest('Please provide both identifier and password');
        }
    
        try {
          // Attempt to find the user by identifier (email/username)
          const user = await strapi.db.query("plugin::users-permissions.user").findOne({
            where: { email: identifier },
          });
    
          if (!user) {
            logData.Activity = 'Invalid Credentials';
            logData.State = 'Failure';
            setImmediate(() => strapi.service('api::log.log').createLog(logData));
            return ctx.badRequest('Invalid credentials');
          }

          const isLocked = await strapi.service('api::users-permissions.auth').checkLoginAttempts(user.id);
          
          if (isLocked) {
            logData.Activity ="Account Locked"
            logData.State = "Failure"
            setImmediate(() => strapi.service('api::log.log').createLog(logData));
            return ctx.unauthorized('Account locked after too many failed logins');
          }
          
          // Validate the user's password using the built-in service
          const isPasswordValid = await strapi.plugins['users-permissions'].services.user.validatePassword(password, user.password);
          if (!isPasswordValid) {
            await strapi.service('api::users-permissions.auth').incrementLoginAttempts(user.id);
            logData.Activity ="Invalid Credentials"
            logData.State = "Failure"
            await strapi.service('api::log.log').createLog(logData)
            return ctx.badRequest('Invalid credentials');
          }

          await strapi.service('api::users-permissions.auth').resetLoginAttempts(user.id);
    
          const [accessToken, refreshToken] = await Promise.all([
            strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id }, { expiresIn: '15m' }),
            strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id }, { expiresIn: '7d' })
          ]);

          logData.Activity = 'Login Success';
          setImmediate(() => strapi.service('api::log.log').createLog(logData));
          
          return ctx.send({ access_token: accessToken, refresh_token: refreshToken });
        } catch (error) {
          return ctx.internalServerError('Something went wrong');
        }
      },
    
      async refresh(ctx: Context) {
        const { refresh_token } = ctx.request.body;
    
        if (!refresh_token) {
          return ctx.badRequest('Refresh token is required');
        }
    
        try {
          // Verify the refresh token
          const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(refresh_token);
          if (!decoded || !decoded.id) {
            return ctx.unauthorized('Invalid or expired refresh token');
          }
    
          // Fetch the user using the decoded user ID
          const user = await strapi.db.query("plugin::users-permissions.user").findOne({
            where: { id: decoded.id },
          });
    
          if (!user) {
            return ctx.notFound('User not found');
          }
    
          // Issue a new access token
          const newAccessToken = strapi.plugins['users-permissions'].services.jwt.issue(
            { id: user.id },
            { expiresIn: '15m' } // New access token
          );
    
          return ctx.send({ access_token: newAccessToken });
        } catch (error) {
          console.error(error);
          return ctx.unauthorized('Invalid or expired refresh token');
        }
      },
      async me(ctx: Context) {
        // Access the authenticated user from the context
        const user = ctx.state.user;
    
        if (!user) {
          return ctx.unauthorized('You must be logged in to access this endpoint.');
        }
    
        // Fetch the user with their role information
        const userWithRole = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { id: user.id },
          populate: {
            role: {
              populate: {
                permissions: true
              }
            }
          }
        })

        if(!userWithRole) return ctx.notFound('User not found')
    
        // Return the user data, including their role
        ctx.send({
          user: {
            id: userWithRole.id,
            username: userWithRole.username,
            email: userWithRole.email,
            role: userWithRole.role.name, // Return the role name
            permissions: userWithRole.role.permissions.map(permission => permission.action)
          },
        });
      },


      async requestPasswordReset(ctx) {
        const { email } = ctx.request.body;
      
        if (!email) {
          return ctx.badRequest('Email is required');
        }
      
        try {
          // Find the user by email
          const user = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { email },
          });
      
          if (!user) {
            return ctx.notFound('User not found');
          }
      
          // Create a reset password token with expiration (e.g., 30 minutes)
          const resetToken = strapi.plugins['users-permissions'].services.jwt.issue(
            { id: user.id },
            { expiresIn: '30m' } // Token expires in 30 minutes
          );
      
          // Store the reset token in the user's record (optional: store it hashed for security)
          await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: user.id },
            data: {
              resetPasswordToken: resetToken, // Store the JWT token in the user record
            },
          });

          let baseUrl = process.env.DOMAIN_URL;

          // If DOMAIN_URL is not set or is empty, use localhost:3000
          if (!baseUrl) {
            baseUrl = process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'http://localhost:3000';
          }
    
      
          // Construct the reset URL for the frontend
          const resetUrl = `${baseUrl}/reset/password?token=${resetToken}`;
          
          // Send the reset link via email using Resend
          try {
            await resend.emails.send({
              from: 'Acme <onboarding@resend.dev>',
              to: "ken.aczel@gmail.com",
              subject: 'Password Reset Request',
              html: `<p>You requested a password reset. Please click the link below to reset your password:</p>
                     <p><a href="${resetUrl}">Reset your password</a></p>
                     <p>This link is valid for 30 minutes.</p>`,
            });
          } catch (emailErr) {
            console.error('Email sending failed:', emailErr);
            // Respond with a general error message to avoid exposing sensitive info
            return ctx.internalServerError('Failed to send the password reset email. Please try again later.');
          }
      
          // Successfully sent email
          return ctx.send({
            message: 'Password reset link has been sent to your email.',
          });
      
        } catch (err) {
          console.error('Error generating reset token or processing request:', err);
          return ctx.internalServerError('Failed to generate reset token. Please try again later.');
        }
      },

      async changePassword(ctx) {
        const { token, newPassword } = ctx.request.body;
    
        if (!token || !newPassword) {
          return ctx.badRequest('Token and new password are required');
        }
    
        try {
          // Verify the token (decode it and check expiration)
          const decoded = await strapi
            .plugin('users-permissions')
            .services.jwt.verify(token);
    
          const userId = decoded.id;
    
          if (!userId) {
            return ctx.badRequest('Invalid token');
          }
    
          // Fetch the user by ID and confirm resetPasswordToken matches
          const user = await strapi.db
            .query('plugin::users-permissions.user')
            .findOne({ where: { id: userId } });
    
          if (!user || user.resetPasswordToken !== token) {
            return ctx.badRequest('Invalid or expired reset token');
          }

    
          // Hash the new password
          const hashedPassword = await strapi.service('admin::auth').hashPassword(newPassword)
    
          // Update the user’s password and clear the reset token
          await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: userId },
            data: {
              password: hashedPassword,
              resetPasswordToken: null, // Clear the reset token
            },
          });
    
          return ctx.send({ message: 'Password has been reset successfully' });
    
        } catch (err) {
          console.error('Password reset error:', err);
          return ctx.badRequest('Invalid or expired token');
        }
      },
}))