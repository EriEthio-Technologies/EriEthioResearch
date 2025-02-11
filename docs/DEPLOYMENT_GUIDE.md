# Deployment Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Vercel account
- PostgreSQL database
- Stripe account (for payments)
- Cloudinary account (for image uploads)

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
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run database migrations:
```bash
npx prisma db push
```

5. Start the development server:
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
   - Ensure NEXTAUTH_URL points to your production domain

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

## Troubleshooting

Common issues and solutions:

1. Build Failures:
   - Check build logs in Vercel
   - Verify all dependencies are correctly installed
   - Ensure environment variables are properly set

2. Database Connection Issues:
   - Verify DATABASE_URL is correct
   - Check if IP is whitelisted in database settings
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