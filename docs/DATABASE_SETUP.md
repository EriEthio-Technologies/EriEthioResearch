# Database Setup Guide

## Overview

This guide provides detailed instructions for setting up and managing the database infrastructure for the EriEthio Research Platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Schema Management](#schema-management)
4. [Data Migration](#data-migration)
5. [Backup & Recovery](#backup--recovery)
6. [Performance Tuning](#performance-tuning)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- PostgreSQL 14 or higher
- Supabase CLI
- Node.js 18 or higher
- pgAdmin 4 (optional)

### Environment Setup
1. Install PostgreSQL:
```bash
# macOS (using Homebrew)
brew install postgresql@14

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql-14
```

2. Install Supabase CLI:
```bash
# Using npm
npm install -g supabase

# Using yarn
yarn global add supabase
```

## Initial Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Configure project settings:
   ```
   Name: eriethio-research
   Database Password: [Generate Strong Password]
   Region: Select Nearest
   Pricing Plan: Choose Appropriate Plan
   ```

### 2. Configure Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Initialize Local Development

```bash
# Initialize Supabase
supabase init

# Start local development
supabase start

# Link to remote project
supabase link --project-ref your-project-ref
```

## Schema Management

### 1. Base Tables

Run migrations in order:

```sql
-- Initial schema
\i supabase/migrations/20240316000000_initial_schema.sql

-- Blog tables
\i supabase/migrations/20240316001000_add_blog_tables.sql

-- Additional features
\i supabase/migrations/20240316002000_add_case_studies.sql
\i supabase/migrations/20240316003000_add_courses.sql
\i supabase/migrations/20240316004000_add_learning_paths.sql
\i supabase/migrations/20240316005000_add_pages.sql
\i supabase/migrations/20240316006000_add_page_templates.sql
\i supabase/migrations/20240316007000_add_page_analytics.sql
\i supabase/migrations/20240316008000_add_page_customization.sql
```

### 2. Indexes

Important indexes for performance:

```sql
-- User-related indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Content-related indexes
CREATE INDEX idx_research_projects_status ON research_projects(status);
CREATE INDEX idx_research_projects_tags ON research_projects USING gin(tags);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_tags ON products USING gin(tags);

-- Analytics indexes
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_user_id ON page_views(user_id);
CREATE INDEX idx_page_events_type ON page_events(event_type);
```

### 3. Functions and Triggers

Key database functions:

```sql
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Track page views
CREATE OR REPLACE FUNCTION track_page_view(
    _page_id UUID,
    _user_id UUID,
    _session_id TEXT,
    _path TEXT,
    _referrer TEXT,
    _user_agent TEXT
) RETURNS UUID AS $$
DECLARE
    _view_id UUID;
BEGIN
    INSERT INTO page_views (
        page_id,
        user_id,
        session_id,
        path,
        referrer,
        user_agent
    ) VALUES (
        _page_id,
        _user_id,
        _session_id,
        _path,
        _referrer,
        _user_agent
    ) RETURNING id INTO _view_id;
    
    RETURN _view_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Data Migration

### 1. Export Data

```bash
# Export entire database
pg_dump -h localhost -U postgres -d your_database > backup.sql

# Export specific tables
pg_dump -h localhost -U postgres -d your_database -t table_name > table_backup.sql
```

### 2. Import Data

```bash
# Import to local database
psql -h localhost -U postgres -d your_database < backup.sql

# Import to Supabase
supabase db reset --db-url your_database_url
```

## Backup & Recovery

### 1. Automated Backups

Set up daily backups:

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/path/to/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATABASE_URL="postgresql://user:password@host:port/database"

# Create backup
pg_dump $DATABASE_URL > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Compress backup
gzip "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

Add to crontab:
```bash
0 0 * * * /path/to/backup.sh
```

### 2. Point-in-Time Recovery

```sql
-- Enable WAL archiving
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'test ! -f /path/to/archive/%f && cp %p /path/to/archive/%f';
```

## Performance Tuning

### 1. Database Configuration

Optimize `postgresql.conf`:

```ini
# Memory Configuration
shared_buffers = 4GB
effective_cache_size = 12GB
maintenance_work_mem = 1GB
work_mem = 50MB

# Query Planning
random_page_cost = 1.1
effective_io_concurrency = 200

# Parallel Query
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_worker_processes = 8

# Write Ahead Log
wal_buffers = 16MB
checkpoint_completion_target = 0.9
```

### 2. Query Optimization

Example of optimizing a slow query:

```sql
-- Before optimization
SELECT *
FROM research_projects
WHERE status = 'active'
  AND created_at > NOW() - INTERVAL '30 days';

-- After optimization
CREATE INDEX idx_research_projects_status_created_at 
ON research_projects(status, created_at);

SELECT id, title, description, status, created_at
FROM research_projects
WHERE status = 'active'
  AND created_at > NOW() - INTERVAL '30 days';
```

## Monitoring

### 1. Key Metrics

Monitor these essential metrics:

```sql
-- Connection count
SELECT count(*) FROM pg_stat_activity;

-- Table sizes
SELECT
    relname as table_name,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as data_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as external_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Cache hit ratio
SELECT 
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit)  as heap_hit,
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

### 2. Slow Query Analysis

```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = '1000';  -- Log queries taking more than 1s

-- Find slow queries
SELECT
    calls,
    total_time / 1000 as total_seconds,
    mean_time / 1000 as mean_seconds,
    query
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

## Troubleshooting

### 1. Common Issues

#### Connection Issues
```bash
# Test connection
psql -h your_host -U your_user -d your_database

# Check max connections
SELECT count(*) FROM pg_stat_activity;
SELECT setting FROM pg_settings WHERE name = 'max_connections';
```

#### Performance Issues
```sql
-- Find blocking queries
SELECT blocked_locks.pid AS blocked_pid,
       blocking_locks.pid AS blocking_pid,
       blocked_activity.usename AS blocked_user,
       blocking_activity.usename AS blocking_user,
       now() - blocked_activity.xact_start AS blocked_transaction_duration,
       blocked_activity.query AS blocked_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.DATABASE IS NOT DISTINCT FROM blocked_locks.DATABASE
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.GRANTED;
```

### 2. Recovery Procedures

#### Corrupt Indexes
```sql
-- Reindex specific table
REINDEX TABLE table_name;

-- Reindex entire database
REINDEX DATABASE database_name;
```

#### Database Corruption
```bash
# Check database integrity
pg_amcheck -d your_database

# Repair with pg_resetwal (last resort)
pg_resetwal -f /path/to/data/directory
```

### 3. Maintenance Tasks

Regular maintenance schedule:

```sql
-- Vacuum analyze
VACUUM ANALYZE;

-- Update statistics
ANALYZE VERBOSE;

-- Rebuild indexes
REINDEX DATABASE your_database;
``` 