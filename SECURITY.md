# Security Policy

## Reporting Security Issues

**How to report:**

- Create a private issue with `[SECURITY]` tag
- Use GitHub's private vulnerability reporting
- Email maintainers directly (see README)

**Response time:** 72 hours to acknowledge, 2 weeks for full response

**Please keep reports confidential** until we've had time to investigate and fix.

## Scope

**We accept reports for:**

- Authentication/authorization bypasses
- SQL injection or XSS vulnerabilities
- Input validation issues
- Session management problems
- Dependency vulnerabilities with active exploits

**Out of scope:**

- Social engineering attacks
- Theoretical vulnerabilities without proof of concept
- Minor information disclosure without security impact

## Response Process

1. **Acknowledge** - Confirm we received your report
2. **Investigate** - Reproduce and assess the issue
3. **Fix** - Develop and test a solution
4. **Deploy** - Push the fix to production
5. **Disclose** - Coordinate public disclosure if needed

## Current Security Measures

- Input validation with Zod schemas
- CORS protection via nuxt-security
- Rate limiting on API routes
- Secure headers (CSP, HSTS, etc.)
- Regular dependency updates

## Disclosure Timeline

- **Critical:** 7 days
- **High:** 30 days
- **Medium/Low:** 90 days

We may request more time for complex fixes.

## Recognition

No bug bounties, but we'll credit you in our changelog and give you a shoutout when we disclose the fix.

## Questions?

Contact the project maintainers listed in the README.
