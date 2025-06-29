# ELOUARATE ART - Premium Art Gallery Frontend

A modern, professional Next.js frontend for the ELOUARATE ART gallery, featuring a beautiful UI, seamless backend integration, and Railway deployment support.

## 🎨 Features

### Modern UI & UX

- **Professional Design**: Dark theme with amber/gold accents
- **Responsive Layout**: Optimized for all devices
- **Smooth Animations**: Framer Motion powered transitions
- **Modern Components**: Built with Radix UI and Tailwind CSS

### Core Functionality

- **Art Gallery**: Browse artworks with advanced filtering
- **User Authentication**: Secure login/registration system
- **Shopping Experience**: Add to cart and wishlist features
- **Artist Showcase**: Premium artist portfolio pages
- **Admin Dashboard**: Complete admin management system

### Technical Excellence

- **Next.js 15**: Latest framework with app router
- **TypeScript**: Full type safety
- **API Integration**: Seamless backend connectivity
- **SEO Optimized**: Meta tags and structured data
- **Performance**: Optimized images and lazy loading

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd frontend-nextjs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

The application will be available at `http://localhost:3001`.

### Environment Configuration

Create a `.env.local` file with:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Authentication
NEXTAUTH_SECRET=your-development-secret
NEXTAUTH_URL=http://localhost:3001

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=contact@elouarateart.com
NEXT_PUBLIC_PHONE=+212658651060
```

## 📁 Project Structure

```
frontend-nextjs/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── artwork/           # Artwork detail pages
│   │   ├── gallery/           # Gallery page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── admin/             # Admin components
│   │   ├── art-management/    # Art management components
│   │   ├── artist/            # Artist showcase components
│   │   └── ui/                # Base UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   └── api.ts             # API client configuration
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── DEPLOYMENT.md              # Deployment guide
└── railway.toml               # Railway configuration
```

## 🎯 Key Components

### Home Page (`src/app/page.tsx`)

- Hero section with statistics
- Featured artworks showcase
- Categories display
- Features highlighting
- Call-to-action sections

### Gallery (`src/app/gallery/page.tsx`)

- Advanced search and filtering
- Grid/List view toggle
- Pagination support
- Price range filtering
- Category-based filtering
- Sorting options

### Authentication (`src/app/auth/`)

- Modern login/register forms
- Error handling and validation
- Success/failure feedback
- Secure token management
- Redirect handling

### Artwork Detail (`src/app/artwork/[id]/page.tsx`)

- Image gallery with zoom
- Detailed artwork information
- Purchase options
- Related artworks
- Social sharing

## 🔌 API Integration

### API Client (`src/lib/api.ts`)

The API client provides organized functions for all backend operations:

```typescript
// Authentication
import { authApi } from "@/lib/api";
await authApi.login({ email, password });
await authApi.register(userData);

// Artworks
import { artworksApi } from "@/lib/api";
await artworksApi.getAll({ page: 1, limit: 12 });
await artworksApi.getById(artworkId);

// Categories
import { categoriesApi } from "@/lib/api";
await categoriesApi.getAll();

// Admin operations
import { adminApi } from "@/lib/api";
await adminApi.getStats();
```

### Features

- **Automatic retries**: Built-in retry logic for failed requests
- **Error handling**: Comprehensive error management
- **Type safety**: Full TypeScript support
- **Loading states**: Integrated loading indicators
- **Caching**: Smart caching strategies

## 🎨 UI Components

Built with modern design principles:

### Design System

- **Colors**: Dark slate backgrounds with amber accents
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing scale
- **Shadows**: Subtle depth and elevation
- **Animations**: Smooth, purposeful transitions

### Component Library

- Form components with validation
- Data display cards and tables
- Navigation and layout components
- Interactive elements (buttons, modals)
- Feedback components (alerts, toasts)

## 🔐 Authentication System

### User Authentication

- Email/password authentication
- Secure token storage
- Automatic session management
- Protected routes
- Role-based access

### Admin Authentication

- Separate admin login flow
- Enhanced security measures
- Admin-only route protection
- Comprehensive permissions

## 📱 Responsive Design

### Breakpoints

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Features

- Mobile-first approach
- Touch-friendly interactions
- Optimized image loading
- Adaptive layouts
- Performance optimization

## 🚀 Deployment

### Railway Deployment

See `DEPLOYMENT.md` for detailed Railway deployment instructions.

Quick deployment:

1. Push code to GitHub
2. Create Railway project
3. Connect GitHub repository
4. Set environment variables
5. Deploy automatically

### Environment Variables for Production

```bash
NEXT_PUBLIC_API_URL=https://your-backend-app.railway.app/api
NEXT_PUBLIC_APP_URL=https://your-frontend-app.railway.app
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-frontend-app.railway.app
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint

# Type checking
npm run type-check   # Check TypeScript types
```

### Development Guidelines

1. **Component Structure**: Follow the established component patterns
2. **Styling**: Use Tailwind CSS classes consistently
3. **Type Safety**: Maintain strict TypeScript standards
4. **Error Handling**: Implement proper error boundaries
5. **Performance**: Optimize images and bundle size

### Code Quality

- ESLint configuration for code consistency
- Prettier for code formatting
- TypeScript for type safety
- Component testing with React Testing Library

## 🔧 Customization

### Theming

Customize the theme in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      // Your custom colors
    }
  }
}
```

### API Configuration

Update API endpoints in `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "your-api-url";
```

### Features

Add new features by:

1. Creating components in `src/components/`
2. Adding pages in `src/app/`
3. Updating API client in `src/lib/api.ts`
4. Adding types in `src/types/`

## 📊 Performance

### Optimization Features

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting by routes
- **Lazy Loading**: Component and image lazy loading
- **Caching**: Static generation and caching strategies
- **Bundle Analysis**: Built-in bundle analyzer

### Monitoring

- Performance metrics tracking
- Error boundary implementation
- Loading state management
- User experience optimization

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**

   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Verify backend is running and accessible
   - Check CORS configuration

2. **Build Failures**

   - Verify Node.js version (18+)
   - Check for TypeScript errors
   - Review dependency compatibility

3. **Authentication Issues**
   - Check `NEXTAUTH_SECRET` configuration
   - Verify token storage and retrieval
   - Review backend authentication endpoints

### Debug Mode

Enable debug mode by setting:

```bash
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Setup

1. Follow the installation instructions
2. Set up the development environment
3. Run the test suite
4. Make your changes
5. Test thoroughly

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

### Getting Help

- Check the troubleshooting section
- Review the deployment guide
- Check GitHub issues
- Contact the development team

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Railway Documentation](https://docs.railway.app)

---

**ELOUARATE ART** - Where tradition meets modern artistic expression. 🎨
