# Security Guidelines

## Implemented Security Features

### 1. **Authentication & Session Management**
- ✅ Strong password hashing with `werkzeug.security`
- ✅ Secure session cookies (HttpOnly, SameSite=Lax)
- ✅ Session timeout (1 hour by default)
- ✅ Session validation on protected routes

### 2. **Password Policy**
- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 number
- ✅ Username: 3+ characters, alphanumeric only

### 3. **Rate Limiting**
- ✅ Login attempts: Max 5 attempts per minute per IP
- ✅ Prevents brute force attacks
- ⚠️ **Production**: Use Redis instead of in-memory storage

### 4. **File Upload Security**
- ✅ Secure filename sanitization
- ✅ File type validation (.xlsx, .xls, .xlsb only)
- ✅ File size limit (16MB)
- ✅ Timestamp-based filenames prevent overwriting
- ✅ File size double-check before processing

### 5. **Configuration Security**
- ✅ Dynamic secret key generation
- ✅ Environment variable support
- ✅ Sensitive data not hardcoded

### 6. **Input Validation**
- ✅ Username/password sanitization (strip whitespace)
- ✅ Required field validation
- ✅ SQL injection protection (SQLAlchemy ORM)

## Production Deployment Checklist

### 🔴 Critical (Before Going Live)

1. **Change Secret Key**
   ```bash
   # Generate a strong secret key
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
   Add to `.env`:
   ```
   SECRET_KEY=<your-generated-key>
   ```

2. **Change Default Admin Password**
   - Login as admin
   - Go to Profile → Change Password
   - Use a strong password (12+ characters, mixed case, numbers, symbols)

3. **Enable HTTPS**
   - Get SSL certificate (Let's Encrypt recommended)
   - Update `app.py`:
     ```python
     app.config['SESSION_COOKIE_SECURE'] = True
     ```

4. **Disable Debug Mode**
   ```python
   app.run(host='0.0.0.0', port=5000, debug=False)
   ```

5. **Use Production WSGI Server**
   ```bash
   # Install gunicorn
   pip install gunicorn
   
   # Run with gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

### 🟡 Important (Within First Week)

6. **Database Security**
   - Move to PostgreSQL for production
   - Use strong database password
   - Restrict database access to localhost only
   - Enable SSL connections to database

7. **Rate Limiting (Production)**
   - Install Redis: `pip install redis flask-limiter`
   - Replace in-memory rate limiting:
     ```python
     from flask_limiter import Limiter
     from flask_limiter.util import get_remote_address
     
     limiter = Limiter(
         app,
         key_func=get_remote_address,
         storage_uri="redis://localhost:6379"
     )
     
     @limiter.limit("5 per minute")
     @app.route('/api/login', methods=['POST'])
     def login():
         ...
     ```

8. **CORS Configuration**
   - If using separate frontend, configure CORS properly
   - Don't use `*` for allowed origins in production

9. **Logging & Monitoring**
   - Set up proper logging (don't print sensitive data)
   - Monitor failed login attempts
   - Alert on suspicious activity

### 🟢 Recommended (Ongoing)

10. **Regular Updates**
    ```bash
    pip list --outdated
    pip install --upgrade <package>
    ```

11. **Backup Strategy**
    - Daily automated database backups
    - Test restore procedures monthly
    - Keep backups encrypted

12. **Security Headers**
    ```python
    @app.after_request
    def set_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        return response
    ```

13. **Content Security Policy (CSP)**
    - Add CSP headers to prevent XSS attacks
    - Configure based on your content sources

14. **Regular Security Audits**
    - Review user accounts monthly
    - Check for unauthorized access attempts
    - Review uploaded files for anomalies

## Environment Variables Setup

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` with your secure values

3. Never commit `.env` to git (already in `.gitignore`)

## Password Best Practices for Users

- **Minimum**: 8 characters, 1 uppercase, 1 number
- **Recommended**: 12+ characters, uppercase, lowercase, numbers, symbols
- **Avoid**: Common words, personal info, keyboard patterns
- **Use**: Password manager (LastPass, 1Password, Bitwarden)
- **Change**: Every 90 days or immediately if compromised

## Reporting Security Issues

If you discover a security vulnerability:
1. **DO NOT** open a public GitHub issue
2. Email: [your-security-email@domain.com]
3. Include: Description, steps to reproduce, impact assessment
4. Expected response time: 48 hours

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Flask Security Best Practices](https://flask.palletsprojects.com/en/latest/security/)
- [SQLAlchemy Security](https://docs.sqlalchemy.org/en/latest/faq/security.html)
