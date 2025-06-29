# API Connection Troubleshooting Guide

## 🚨 **Current Issue: 404 Error**

You're getting a **404 (Not Found)** error when trying to connect to your backend API. This means the endpoints we're trying to call don't exist at those URLs.

---

## 🧪 **Step 1: Discover Your API Structure**

1. **Run the Endpoint Discovery Tool**:

   - Visit your frontend: `http://localhost:3000`
   - Click **"Discover Available Endpoints"**
   - This will test multiple URL patterns to find what actually works

2. **What to Look For**:
   - ✅ **Green badges** = Working endpoints
   - ❌ **Red badges** = Failed endpoints
   - Look at the response data to understand your API structure

---

## 🔍 **Common API Patterns to Check**

Your backend might be using one of these patterns:

### Pattern 1: With `/api` prefix

```
https://artelouarrate-production.up.railway.app/api/categories
https://artelouarrate-production.up.railway.app/api/artworks
```

### Pattern 2: Without `/api` prefix

```
https://artelouarrate-production.up.railway.app/categories
https://artelouarrate-production.up.railway.app/artworks
```

### Pattern 3: Different route names

```
https://artelouarrate-production.up.railway.app/category
https://artelouarrate-production.up.railway.app/artwork
```

---

## 🛠 **Step 2: Manual Testing (Optional)**

You can also test your backend manually:

### Test in Browser

Open these URLs in your browser:

- `https://artelouarrate-production.up.railway.app/`
- `https://artelouarrate-production.up.railway.app/api`
- `https://artelouarrate-production.up.railway.app/categories`
- `https://artelouarrate-production.up.railway.app/api/categories`

### Test with cURL (Command Line)

```bash
curl https://artelouarrate-production.up.railway.app/categories
curl https://artelouarrate-production.up.railway.app/api/categories
```

---

## 🔧 **Step 3: Fix Based on What You Find**

Once you know which endpoints work, I'll update the frontend configuration to match your backend's actual API structure.

### If you find working endpoints, tell me:

1. **Which URLs work?** (e.g., with or without `/api`)
2. **What data structure they return?** (categories format)
3. **Any authentication required?**

---

## 🚨 **Common Issues & Solutions**

### Issue 1: Backend Not Running

**Symptoms**: All endpoints return network errors
**Solution**: Check if your Railway backend is running and deployed

### Issue 2: Wrong API Prefix

**Symptoms**: 404 errors on `/api/*` routes
**Solution**: Your backend might not use `/api` prefix

### Issue 3: Different Route Names

**Symptoms**: 404 on `/categories` but other routes work
**Solution**: Your backend might use `/category` (singular) or different names

### Issue 4: CORS Issues

**Symptoms**: Network errors from browser, but cURL works
**Solution**: Backend needs CORS headers for frontend domain

### Issue 5: Authentication Required

**Symptoms**: 401/403 errors
**Solution**: API might require authentication tokens

---

## 📋 **Backend Checklist**

Make sure your Railway backend has:

- [ ] **Deployed successfully** (check Railway dashboard)
- [ ] **Categories endpoint** (`/categories` or `/api/categories`)
- [ ] **Artworks endpoint** (`/artworks` or `/api/artworks`)
- [ ] **CORS enabled** for your frontend domain
- [ ] **JSON responses** (not HTML error pages)
- [ ] **Health check endpoint** (optional but helpful)

---

## 🎯 **Next Steps**

1. **Run the endpoint discovery tool** on your home page
2. **Share the results** - which endpoints work and what data they return
3. **I'll update the frontend** to match your actual backend API structure
4. **Test the full connection** once properly configured

---

## 💡 **Quick Fixes to Try**

### Fix 1: Update API Base URL

If you find that endpoints work without `/api`:

```typescript
// In src/lib/api.ts, change this line:
const API_BASE_URL = "https://artelouarrate-production.up.railway.app";
// Instead of:
const API_BASE_URL = "https://artelouarrate-production.up.railway.app/api";
```

### Fix 2: Check Your Backend Routes

In your backend code, make sure you have:

```javascript
// Example Express.js routes
app.get('/categories', (req, res) => { ... })
app.get('/artworks', (req, res) => { ... })

// OR with /api prefix
app.get('/api/categories', (req, res) => { ... })
app.get('/api/artworks', (req, res) => { ... })
```

---

## 🆘 **If Nothing Works**

If all endpoints return 404:

1. **Check Railway Dashboard**: Is your backend deployed and running?
2. **Check Backend Logs**: Any errors in Railway deployment logs?
3. **Verify Domain**: Is `artelouarrate-production.up.railway.app` the correct URL?
4. **Test Simple Endpoint**: Create a simple `/health` or `/` route that returns JSON

---

**Run the endpoint discovery tool now and let me know what you find!** 🚀
