# Deployment Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Vercel account
- Supabase account

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd eri-ethio-research-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Production Deployment

### Deploying to Vercel

1. Push your code to GitHub/GitLab/Bitbucket

2. Connect your repository to Vercel:
   - Log in to your Vercel account
   - Click "New Project"
   - Import your repository
   - Configure project settings:
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

3. Configure Environment Variables:
   - Add all environment variables from `.env.local` to Vercel's project settings
   - For production, update `NEXTAUTH_URL` to your production domain
   - Make sure all Supabase environment variables are correctly set

4. Deploy:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Post-Deployment Steps

1. Set up your custom domain (if applicable):
   - Go to Project Settings > Domains
   - Add your domain and follow DNS configuration instructions

2. Verify SSL/TLS configuration

3. Monitor deployment:
   - Check Vercel's deployment logs
   - Verify all environment variables
   - Test all functionality in production

## Database Setup

1. Create a new Supabase project:
   - Go to https://supabase.com
   - Create a new project
   - Get your project URL and anon key

2. Set up database tables:
   - Use the SQL editor in Supabase
   - Create necessary tables for:
     - Users/Profiles
     - Research Projects
     - Publications
     - Collaborators
     - Activity Logs

3. Configure authentication:
   - Enable Email/Password sign-up
   - Configure OAuth providers if needed

## Troubleshooting

Common issues and solutions:

1. Build Failures:
   - Check build logs in Vercel
   - Verify all dependencies are correctly installed
   - Ensure environment variables are properly set

2. Database Connection Issues:
   - Verify Supabase URL and anon key are correct
   - Check if IP is whitelisted in Supabase settings
   - Ensure database is accessible from deployment environment

3. Authentication Problems:
   - Verify NEXTAUTH_URL matches your domain
   - Check NEXTAUTH_SECRET is properly set
   - Ensure all OAuth providers are correctly configured

## Monitoring and Maintenance

1. Set up monitoring:
   - Enable Vercel Analytics
   - Configure error tracking (e.g., Sentry)
   - Set up performance monitoring

2. Regular maintenance:
   - Keep dependencies updated
   - Monitor database performance
   - Regular backups
   - Security updates

## Security Considerations

1. Environment Variables:
   - Never commit .env files
   - Use strong, unique values for secrets
   - Regularly rotate sensitive credentials

2. Database Security:
   - Regular backups
   - Use strong passwords
   - Keep database updated
   - Implement proper access controls

3. API Security:
   - Rate limiting
   - Input validation
   - CORS configuration
   - API authentication

## Deployment Checklist

Before deploying:
- [ ] Run `npm run build` locally to verify build
- [ ] Test all features in development
- [ ] Check all environment variables
- [ ] Verify database connections
- [ ] Test authentication flows
- [ ] Check responsive design
- [ ] Verify API endpoints
- [ ] Test error handling
- [ ] Check performance metrics

After deploying:
- [ ] Verify SSL/TLS setup
- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Check analytics setup
- [ ] Verify backup systems
- [ ] Test user flows
- [ ] Monitor performance
- [ ] Check security headers 