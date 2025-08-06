# `@workspace/email`

This package contains the email sending logic for your project. It provides flexibility by allowing you to choose between different mailers to suit your needs.

## Providers

- Console: Useful for local development. Emails are logged to the console instead of being sent.
- Nodemailer: A popular Node.js library for sending emails via SMTP. Great for self-hosted or custom SMTP setups.
- Postmark: A reliable transactional email service. Offers fast delivery and excellent deliverability for production use.
- Resend: A developer-friendly email API that uses AWS SES under the hood, simplifying email setup while maintaining reliability.
- SendGrid: Scalable cloud-based email service with advanced features for both transactional and marketing emails.
