# 🚀 Complete Railway Deployment Guide

## Overview

This guide will help you deploy both your **Backend** and **Frontend** to Railway and connect them properly.

---

## 📋 Prerequisites

- [ ] Railway account (free tier works)
- [ ] GitHub repository with your code
- [ ] Backend code ready (your current backend)
- [ ] Frontend code ready (this Next.js app)

---

## 🎯 Deployment Strategy

We'll deploy:

1. **Backend** → Railway service #1
2. **Frontend** → Railway service #2
3. **Connect them** → Environment variables

---

## 🔧 Step 1: Deploy Backend to Railway

### 1.1 Create Backend Service

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Connect your GitHub repository
4. Select your **backend folder** (e.g., `backend/` or root if backend is in root)

### 1.2 Backend Environment Variables

Add these in Railway Dashboard → Your Backend Service → Variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=your_frontend_domain_here
```

### 1.3 Backend Deployment Settings

Make sure your backend has:

**package.json scripts:**

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build step needed'"
  }
}
```

**railway.toml (optional):**

```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
startCommand = "npm start"

[env]
NODE_ENV = "production"
```

### 1.4 Test Backend

Your backend will be available at: `https://your-backend-name.up.railway.app`

Test these endpoints:

- `https://your-backend-name.up.railway.app/api/categories`
- `https://your-backend-name.up.railway.app/health`

---

## 🎨 Step 2: Deploy Frontend to Railway

### 2.1 Create Frontend Service

1. In Railway Dashboard, click **"New Service"** in same project
2. Connect to your GitHub repository
3. Select your **frontend-nextjs folder**
4. Railway should auto-detect it's a Next.js app

### 2.2 Frontend Environment Variables

Add these in Railway Dashboard → Your Frontend Service → Variables:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-name.up.railway.app/api
```

**Important:** Replace `your-backend-name` with your actual backend Railway URL!

### 2.3 Frontend Build Configuration

Your `railway.toml` should be:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && npm run build"

[deploy]
healthcheckPath = "/"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[env]
NODE_ENV = "production"
NEXT_PUBLIC_API_URL = "${{BACKEND_URL}}/api"
```

### 2.4 Package.json Scripts

Make sure you have these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🔗 Step 3: Connect Backend & Frontend

### 3.1 Get Backend URL

1. Go to your backend service in Railway
2. Copy the domain (e.g., `https://backend-production-abc123.up.railway.app`)

### 3.2 Update Frontend Environment

In your frontend service, update:

```env
NEXT_PUBLIC_API_URL=https://your-actual-backend-url.up.railway.app/api
```

### 3.3 Update Backend CORS

In your backend, make sure CORS allows your frontend domain:

```javascript
// In your backend server.js or app.js
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000", // for development
      "https://your-frontend-name.up.railway.app", // for production
    ],
    credentials: true,
  })
);
```

---

## 🧪 Step 4: Test Deployment

### 4.1 Test Backend

Visit: `https://your-backend-name.up.railway.app/api/categories`
Should return JSON with your categories.

### 4.2 Test Frontend

Visit: `https://your-frontend-name.up.railway.app`

### 4.3 Test Connection

1. Go to your frontend website
2. Use the **API Endpoint Discovery** tool
3. All endpoints should show ✅ **Success**

---

## 🔧 Step 5: Domain Setup (Optional)

### 5.1 Custom Domain for Backend

1. Railway Dashboard → Backend Service → Settings → Domains
2. Add your custom domain (e.g., `api.yourdomain.com`)

### 5.2 Custom Domain for Frontend

1. Railway Dashboard → Frontend Service → Settings → Domains
2. Add your custom domain (e.g., `yourdomain.com`)

### 5.3 Update Environment Variables

If using custom domains, update:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

## 🐛 Troubleshooting

### Issue 1: Build Fails

**Symptoms:** Deployment fails during build
**Solutions:**

- Check `package.json` has correct scripts
- Ensure all dependencies are in `package.json`
- Check build logs in Railway dashboard

### Issue 2: Frontend Can't Connect to Backend

**Symptoms:** API calls return CORS or network errors
**Solutions:**

- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS settings
- Test backend endpoint directly in browser

### Issue 3: Environment Variables Not Working

**Symptoms:** App behaves like in development
**Solutions:**

- Double-check environment variable names
- Redeploy after adding env vars
- Environment vars must start with `NEXT_PUBLIC_` for client-side access

### Issue 4: 404 on All Routes

**Symptoms:** Only home page works, other routes return 404
**Solutions:**

- Ensure Next.js build includes all pages
- Check if dynamic routes are properly configured

### Issue 5: Images Not Loading

**Symptoms:** Images return 404 or don't display
**Solutions:**

- Update `next.config.js` for image domains
- Use Railway's public folder for assets
- Update image paths for production

---

## 📊 Monitoring & Maintenance

### Check Logs

- Railway Dashboard → Service → Logs
- Monitor for errors and performance

### Scaling

- Railway auto-scales based on usage
- Monitor usage in Railway dashboard

### Updates

- Push to GitHub → Railway auto-deploys
- Monitor deployments in Railway dashboard

---

## 🎉 Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API connection working (test with discovery tool)
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Custom domains set up (if desired)
- [ ] Both services auto-deploy on Git push

---

## 🚀 Your Live URLs

After deployment, you'll have:

**Backend API:** `https://your-backend-name.up.railway.app/api`
**Frontend Website:** `https://your-frontend-name.up.railway.app`

**Your art gallery is now live! 🎨**

---

## 📞 Support

If you encounter issues:

1. Check Railway dashboard logs
2. Test individual components
3. Verify environment variables
4. Check GitHub repository structure

**Happy Deploying! 🚀**
