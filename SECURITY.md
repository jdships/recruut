# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Recruut seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to **security@recruut.com**.

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

- **Type of issue** (buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths of source file(s) related to the vulnerability**
- **The location of the affected source code** (tag/branch/commit or direct URL)
- **Any special configuration required to reproduce the issue**
- **Step-by-step instructions to reproduce the issue**
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Preferred Languages

We prefer all communications to be in English.

## Policy

Recruut follows the principle of [Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure).

## Security Best Practices

### For Contributors

- Never commit sensitive data (API keys, passwords, tokens)
- Use environment variables for all configuration
- Validate and sanitize all user inputs
- Follow the principle of least privilege
- Keep dependencies updated
- Use HTTPS in production
- Implement proper authentication and authorization
- Log security events appropriately

### For Users

- Keep your Recruut installation updated
- Use strong, unique passwords
- Enable two-factor authentication when available
- Regularly review access permissions
- Monitor for suspicious activity
- Back up your data regularly
- Use HTTPS in production environments

## Security Features

Recruut includes several security features:

- **Authentication**: Secure user authentication with Auth.js
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive input validation with Zod
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: Built-in CSRF protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Secure Headers**: Security headers for web applications

## Security Updates

Security updates will be released as patch versions (e.g., 1.0.1, 1.0.2) and will be clearly marked as security releases in the changelog.

## Disclosure Timeline

- **Day 0**: Vulnerability reported
- **Day 1-2**: Initial response and triage
- **Day 3-7**: Investigation and fix development
- **Day 8-14**: Testing and validation
- **Day 15**: Security release published

## Credits

We would like to thank all security researchers who responsibly disclose vulnerabilities to us. Contributors will be credited in our security advisories and release notes.

## Contact

- **Security Email**: security@recruut.com
- **PGP Key**: [Available upon request]
- **Security Team**: Recruut Security Team

---

Thank you for helping keep Recruut secure! 🔒 