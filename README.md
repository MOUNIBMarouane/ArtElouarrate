# 🎨 ELOUARATE ART - Full Stack Application

A complete art gallery platform with React frontend, Node.js backend, and Supabase database.

## ✨ Features

- 🎨 **Modern React Frontend** - Beautiful UI with Tailwind CSS
- ⚡ **Node.js Backend API** - RESTful API with Express
- 🗄️ **Supabase Database** - PostgreSQL with Prisma ORM
- 🔐 **Authentication System** - User registration and login
- 📱 **Responsive Design** - Works on all devices
- 🚀 **Production Ready** - Optimized for Vercel deployment

## 🚀 Quick Start

### **Method 1: One Command Start (Easiest)**

```bash
# Start both frontend and backend
npm run dev
```

This will:

- ✅ Set up environment variables automatically
- ✅ Generate Prisma client
- ✅ Start backend API on http://localhost:3000
- ✅ Start frontend on http://localhost:8080

### **Method 2: Manual Start**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd Frontend
npm run dev
```

## 📦 Installation

### **Prerequisites**

- Node.js 18+
- npm or yarn

### **Setup**

```bash
# 1. Clone and navigate
git clone <your-repo>
cd storePint

# 2. Install all dependencies
npm run install-all

# 3. Start the application
npm run dev
```

## 🌐 Application URLs

| Service      | URL                       | Description                                           |
| ------------ | ------------------------- | ----------------------------------------------------- |
| **Frontend** | http://localhost:8080     | React application                                     |
| **Backend**  | http://localhost:3000     | API server                                            |
| **API Docs** | http://localhost:3000/api | API endpoints                                         |
| **Database** | http://localhost:5555     | Prisma Studio (run `cd backend && npx prisma studio`) |

## 🔧 Configuration

### **Environment Variables**

The application automatically creates the required `.env` file with Supabase credentials.

### **Database Schema**

The database includes:

- **Users** - User authentication
- **Artworks** - Art pieces with images
- **Categories** - Art categorization
- **Orders** - Purchase management
- **Inquiries** - Customer inquiries

## 📡 API Endpoints

### **Authentication**

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### **Artworks**

- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get single artwork

### **Categories**

- `GET /api/categories` - Get all categories

### **System**

- `GET /api/health` - Server health check
- `GET /api/test-supabase` - Database connection test

## 🧪 Testing Your Setup

### **1. Test Backend**

```bash
curl http://localhost:3000/api/health
```

### **2. Test Registration**

1. Go to http://localhost:8080/register
2. Fill out the form:
   - **First Name:** Ahmed
   - **Last Name:** Ennaki
   - **Email:** test@example.com
   - **Password:** password123
3. Click "Create Account"

### **3. Check Database**

```bash
cd backend
npx prisma studio
```

## 🏗️ Project Structure

```
storePint/
├── Frontend/                 # React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Application pages
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utilities and API
│   │   └── main.tsx        # Entry point
│   └── package.json
│
├── backend/                 # Node.js API
│   ├── api/
│   │   └── index.js        # Main API server
│   ├── lib/
│   │   ├── db.js           # Prisma client
│   │   └── supabase.js     # Supabase client
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── start-app.js            # Master startup script
└── package.json            # Root package.json
```

## 🚀 Deployment

### **Vercel Deployment**

```bash
# 1. Build frontend
cd Frontend && npm run build

# 2. Deploy backend (includes frontend)
cd ../backend && vercel --prod
```

### **Environment Variables for Production**

Add these in Vercel dashboard:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`

## 🛠️ Development

### **Available Scripts**

```bash
# Root level
npm run dev          # Start both frontend and backend
npm run backend      # Start only backend
npm run frontend     # Start only frontend
npm run install-all  # Install all dependencies
npm run build        # Build frontend for production

# Backend specific
cd backend
npm run dev          # Start API server
npm run db:studio    # Open Prisma Studio
npm run db:push      # Push schema to database

# Frontend specific
cd Frontend
npm run dev          # Start development server
npm run build        # Build for production
```

## 🔍 Troubleshooting

### **Common Issues**

1. **Port already in use**

   ```bash
   # Kill processes on ports
   npx kill-port 3000 8080
   ```

2. **Database connection error**

   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

3. **Dependencies issue**
   ```bash
   npm run install-all
   ```

### **Logs and Debugging**

- Check browser console for frontend errors
- Backend logs appear in terminal
- Use `console.log()` for debugging

## 📚 Tech Stack

### **Frontend**

- React 18 + TypeScript
- Vite build tool
- Tailwind CSS + shadcn/ui
- React Query for data fetching
- React Router for navigation

### **Backend**

- Node.js + Express
- Prisma ORM
- Supabase PostgreSQL
- JWT authentication
- Vercel deployment ready

### **Database**

- Supabase PostgreSQL
- Prisma schema management
- Connection pooling
- Real-time subscriptions ready

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 You're Ready!

Your full-stack art gallery application is now:

- ✅ **Fully Configured** - All settings in place
- ✅ **Database Connected** - Supabase PostgreSQL ready
- ✅ **Authentication Working** - User registration/login
- ✅ **API Functional** - RESTful endpoints
- ✅ **Frontend Connected** - React app communicating with backend
- ✅ **Production Ready** - Optimized for deployment

**Happy coding! 🚀**
#   A r t E l o u a r r a t e  
 # ArtElouarrate
