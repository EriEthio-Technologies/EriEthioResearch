## Security Policy

### Reporting Vulnerabilities
- **Critical Issues**: Email security@eriethioresearch.com with [SECURITY] in subject
- **Response Time**: 24 hours for critical issues
- **Scope**: All admin interfaces and API endpoints

### Protected Resources
- User management endpoints
- Database connection strings
- Authentication flows
- Analytics ingestion APIs

### Audit Schedule
- Quarterly third-party audits
- Monthly dependency updates
- Daily security scans

## Critical Security Controls

### Data Protection
- All user passwords hashed with Argon2id
- Sensitive data encrypted at rest
- TLS 1.3 enforced for all connections

### Access Control
- Role-based access for admin interfaces
- Session timeout after 15 minutes
- 2FA required for admin operations

### Monitoring
- Real-time security event logging
- Anomaly detection for API traffic
- Daily vulnerability scans 