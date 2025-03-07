export default ({ env }: { env: any }) => ({
    email: {
      config: {
        provider: 'nodemailer',  // Nodemailer is used to send emails
        providerOptions: {
          host: env('SMTP_HOST', 'smtp.postmarkapp.com'),  // Postmark's SMTP host
          port: env.int('SMTP_PORT', 587),  // Use the default SMTP port for Postmark
          auth: {
            user: env('SMTP_USERNAME', 'a30de410-93bc-4a08-a96f-347d4252dbea'),  // Your Postmark API Key as username
            pass: env('SMTP_PASSWORD', 'a30de410-93bc-4a08-a96f-347d4252dbea'),  // Your Postmark API Key as password
          },
          secure: env.bool('SMTP_SECURE', false),  // Secure connection flag (false for port 587)
        },
        settings: {
          defaultFrom: env('SMTP_FROM', 'k2325823@kingston.ac.uk'),  // Default From email address
          defaultReplyTo: env('SMTP_REPLY_TO', 'k2325823@kingston.ac.uk'),  // Default Reply-To email address
        },
      },
    },
  });
  