# Quick Start Guide

## Overview

This guide will help you get the EriEthio Research Platform up and running quickly. Follow these steps to set up your development environment and deploy your first version.

## Prerequisites

- Node.js v18 or higher
- Git
- VS Code (recommended)
- Supabase account
- Vercel account (for deployment)

## 5-Minute Setup

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/your-org/eri-ethio-research.git
cd eri-ethio-research

# Install dependencies
npm install
```

### 2. Environment Setup

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Setup

1. Create Supabase project at https://supabase.com
2. Run initial migrations:
```bash
npx supabase db reset
```

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your app running.

## Key Features

### 1. Page Builder
- Create dynamic pages with drag-and-drop sections
- Customize layouts, styles, and content
- Save and reuse templates

### 2. Research Management
- Create and manage research projects
- Track collaborators and publications
- Monitor project milestones

### 3. Analytics Dashboard
- Track user engagement
- Monitor performance metrics
- Generate reports

### 4. User Management
- Role-based access control
- User authentication
- Profile management

## Common Tasks

### Creating a New Page

1. Navigate to `/admin/pages`
2. Click "New Page"
3. Add sections using the page builder
4. Configure SEO settings
5. Publish

### Adding a Research Project

1. Go to `/admin/research`
2. Click "New Project"
3. Fill in project details:
   - Title
   - Description
   - Methodology
   - Team members
4. Set up milestones
5. Publish

### Managing Users

1. Access `/admin/users`
2. Add new users or modify existing ones
3. Assign roles:
   - Admin
   - Researcher
   - User

## Development Workflow

### 1. Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push changes
git push origin feature/your-feature
```

### 2. Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

### 3. Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Deployment

### 1. Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy

### 2. Post-Deployment

1. Set up custom domain
2. Configure SSL
3. Set up monitoring
4. Test all features

## Troubleshooting

### Common Issues

1. Database Connection
```bash
# Test connection
npx supabase test db
```

2. Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
```

3. Authentication Issues
- Verify environment variables
- Check NextAuth configuration
- Test login flow

## Next Steps

1. Explore Documentation
   - [Implementation Guide](./IMPLEMENTATION.md)
   - [Database Guide](./DATABASE_SETUP.md)
   - [Analytics Guide](./ANALYTICS_MONITORING.md)

2. Join Community
   - GitHub Discussions
   - Discord Server
   - Stack Overflow

3. Contribute
   - Read [Contributing Guide](./CONTRIBUTING.md)
   - Submit issues
   - Create pull requests

## Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@eriethio.com
- Community: Discord Server 