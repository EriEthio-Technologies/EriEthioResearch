# Database Management Guide

## Overview
This guide covers database management for the EriEthio Research Website. The project uses PostgreSQL as the database and Prisma as the ORM.

## Database Schema

The database includes the following main tables:
- Users
- Products
- Orders
- Blog Posts
- Case Studies
- Categories
- Comments
- Media

## Managing Database with Prisma

### Prerequisites
- PostgreSQL installed
- Prisma CLI (`npm install -g prisma`)
- Database connection string in `.env.local`

### Common Database Operations

#### 1. Creating New Tables

1. Edit `prisma/schema.prisma`:
```prisma
model NewTable {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Add your fields here
}
```

2. Apply changes:
```bash
npx prisma db push
# or for production
npx prisma migrate dev --name add_new_table
```

#### 2. Modifying Existing Tables

1. Update the model in `schema.prisma`
2. Run migration:
```bash
npx prisma migrate dev --name describe_your_changes
```

#### 3. Database Backups

Regular backups:
```bash
pg_dump -U your_username -d your_database > backup.sql
```

Restore from backup:
```bash
psql -U your_username -d your_database < backup.sql
```

## Adding New Content Types

### Adding a New Product Type

1. Update `schema.prisma`:
```prisma
model Product {
  // Existing fields...
  newField String?
}
```

2. Generate migration:
```bash
npx prisma migrate dev
```

3. Update API routes in `src/app/api/products/`

### Creating Blog Articles

1. Use the admin dashboard at `/admin/blog`
2. Required fields:
   - Title
   - Content (Markdown supported)
   - Featured Image
   - Categories
   - Author

### Managing Case Studies

1. Access case study management at `/admin/case-studies`
2. Required information:
   - Project Title
   - Client Details
   - Challenge Description
   - Solution
   - Results
   - Images

## Database Maintenance

### Regular Tasks

1. Index Maintenance:
```sql
REINDEX DATABASE your_database_name;
```

2. Vacuum Database:
```sql
VACUUM ANALYZE;
```

3. Monitor Performance:
```sql
SELECT * FROM pg_stat_activity;
```

### Optimization Tips

1. Use appropriate indexes:
```sql
CREATE INDEX idx_name ON table_name(column_name);
```

2. Regular cleanup:
```sql
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days';
```

## Troubleshooting

### Common Issues

1. Connection Issues:
- Check DATABASE_URL in `.env.local`
- Verify network connectivity
- Check firewall settings

2. Performance Problems:
- Run `EXPLAIN ANALYZE` on slow queries
- Check index usage
- Monitor connection pool

3. Migration Failures:
- Backup before migrations
- Check migration history
- Review constraint conflicts

## Security Best Practices

1. Access Control:
- Use role-based access
- Limit connection privileges
- Regular security audits

2. Data Protection:
- Encrypt sensitive data
- Regular backups
- Implement rate limiting

3. Query Safety:
- Use parameterized queries
- Validate input data
- Implement proper error handling

## Monitoring and Logging

1. Set up monitoring:
```sql
CREATE EXTENSION pg_stat_statements;
```

2. Monitor key metrics:
- Connection count
- Query performance
- Disk usage
- Cache hit ratio

## Scaling Guidelines

1. Vertical Scaling:
- Increase resources
- Optimize configurations
- Monitor resource usage

2. Horizontal Scaling:
- Implement read replicas
- Consider sharding
- Use connection pooling 