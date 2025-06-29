# ELOUARATE ART - Frontend Deployment Guide

## Railway Deployment

This guide will help you deploy the ELOUARATE ART frontend to Railway.

### Prerequisites

1. Railway account ([railway.app](https://railway.app))
2. GitHub repository with your code
3. Backend API deployed (see backend deployment guide)

### Environment Variables

Set the following environment variables in Railway:

#### Required Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-app.railway.app/api

# App Configuration
NEXT_PUBLIC_APP_NAME=ELOUARATE ART
NEXT_PUBLIC_APP_URL=https://your-frontend-app.railway.app

# Authentication
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-generate-a-new-one
NEXTAUTH_URL=https://your-frontend-app.railway.app

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=contact@elouarateart.com
NEXT_PUBLIC_SUPPORT_EMAIL=support@elouarateart.com
NEXT_PUBLIC_PHONE=+212658651060
```

#### Optional Variables

```bash
# Social Media
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/elouarateart
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/elouarateart

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Error Tracking
SENTRY_DSN=your-sentry-dsn
```

### Deployment Steps

1. **Create New Railway Project**

   ```bash
   # Install Railway CLI (optional)
   npm install -g @railway/cli

   # Login to Railway
   railway login
   ```

2. **Deploy from GitHub**

   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `frontend-nextjs` folder as the root directory

3. **Configure Build Settings**

   - Railway will automatically detect this as a Node.js project
   - Build command: `npm run build`
   - Start command: `npm start`
   - Node version: 18+

4. **Set Environment Variables**

   - Go to your project dashboard
   - Click on "Variables" tab
   - Add all required environment variables listed above

5. **Deploy**
   - Railway will automatically deploy when you push to your main branch
   - Monitor the build logs for any issues

### Domain Configuration

1. **Custom Domain (Optional)**

   - Go to your Railway project dashboard
   - Click on "Settings"
   - Add your custom domain
   - Configure DNS records as instructed

2. **HTTPS**
   - Railway automatically provides HTTPS for all deployments
   - No additional configuration needed

### Backend Integration

Make sure your backend is deployed and accessible. Update the following:

1. **CORS Configuration** (in your backend)

   ```javascript
   // Add your Railway frontend URL to CORS origins
   origin: [
     "https://your-frontend-app.railway.app",
     // ... other origins
   ];
   ```

2. **API URL**
   - Update `NEXT_PUBLIC_API_URL` to point to your Railway backend URL
   - Format: `https://your-backend-app.railway.app/api`

### Monitoring & Logs

1. **View Logs**

   ```bash
   # Using Railway CLI
   railway logs

   # Or view in Railway dashboard
   ```

2. **Health Checks**
   - Railway automatically monitors your app health
   - The app is accessible at `/` (health check endpoint)

### Troubleshooting

#### Build Failures

1. **Node Version Issues**

   - Ensure Node.js 18+ is specified in railway.toml
   - Check package.json for compatible dependencies

2. **Memory Issues**

   - Increase memory limit in Railway settings if needed
   - Optimize build process by reducing bundle size

3. **Environment Variables**
   - Verify all required variables are set
   - Check variable names for typos
   - Ensure sensitive values are properly encoded

#### Runtime Issues

1. **API Connection Issues**

   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check backend CORS configuration
   - Ensure backend is running and accessible

2. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your Railway domain
   - Ensure SSL/HTTPS configuration is correct

### Performance Optimization

1. **Static Assets**

   - Images are served from `/public` directory
   - Consider using a CDN for large assets

2. **Build Optimization**

   - Next.js automatically optimizes builds
   - Enable compression in production

3. **Caching**
   - Railway provides automatic caching
   - Configure additional caching headers if needed

### Security Considerations

1. **Environment Variables**

   - Never commit `.env` files to version control
   - Use Railway's environment variable management
   - Rotate secrets regularly

2. **API Security**
   - Ensure backend has proper authentication
   - Use HTTPS for all API communications
   - Implement rate limiting

### Backup & Recovery

1. **Database Backups**

   - Handled by your backend deployment
   - Ensure regular backups are configured

2. **Code Backups**
   - Code is backed up in your GitHub repository
   - Tag releases for easy rollbacks

### Updates & Maintenance

1. **Automatic Deployments**

   - Railway deploys automatically on git push
   - Configure branch protection for production

2. **Dependency Updates**

   - Regularly update dependencies
   - Test updates in staging environment first

3. **Monitoring**
   - Set up alerts for downtime
   - Monitor performance metrics
   - Track error rates

## Local Development

For local development, create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXTAUTH_SECRET=your-local-development-secret
NEXTAUTH_URL=http://localhost:3001
```

Then run:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3001`.

## Support

For deployment issues:

- Check Railway documentation
- Review build and runtime logs
- Contact support if needed

For application issues:

- Check the application logs in Railway dashboard
- Review error tracking (if Sentry is configured)
- Test locally to reproduce issues
