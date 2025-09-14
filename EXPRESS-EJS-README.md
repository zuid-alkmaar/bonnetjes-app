# Bonnetjes Cafe - Express + EJS + TypeScript

A clean, straightforward cafe order management system built with Express.js, EJS templating, and TypeScript.

## 🎯 **What This Is**

A **single Express server** that serves both:
- **Web pages** (HTML with EJS templates)
- **API endpoints** (JSON responses)

No React, no Next.js, no complex frontend frameworks. Just **server-rendered HTML** with modern styling and JavaScript.

## 🚀 **Quick Start**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up database
npm run db:push
npm run db:seed

# Start the server
npm run dev
```

**Open your browser:** `http://localhost:3001`

## 📁 **Project Structure**

```
server/
├── src/
│   ├── app.ts              # Main Express application
│   ├── routes/
│   │   ├── web.ts          # HTML page routes
│   │   ├── products.ts     # Product API routes
│   │   ├── orders.ts       # Order API routes
│   │   └── dashboard.ts    # Dashboard API routes
│   └── scripts/
│       └── seed.ts         # Database seeding
├── views/
│   ├── layout.ejs          # Main layout template
│   ├── dashboard.ejs       # Dashboard page
│   ├── orders.ejs          # Orders listing
│   ├── products.ejs        # Products catalog
│   ├── create-order.ejs    # Order creation form
│   ├── view-order.ejs      # Order details
│   └── error.ejs           # Error page
├── public/
│   ├── css/style.css       # Custom styles
│   └── js/app.js           # Client-side JavaScript
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── dev.db              # SQLite database
└── package.json
```

## 🌐 **Pages Available**

- **Dashboard** - `/` - Overview with stats and recent orders
- **Orders** - `/orders` - List all orders with actions
- **Products** - `/products` - View all menu items
- **Create Order** - `/orders/new` - Interactive order creation
- **View Order** - `/orders/:id` - Order details and timeline

## 🔧 **Technology Stack**

- **Express.js** - Web framework
- **EJS** - Server-side templating
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Font Awesome** - Icons
- **Prisma** - Database ORM
- **SQLite** - Local database

## ✨ **Features**

### 📱 **Mobile Responsive**
- Works perfectly on phones, tablets, and desktops
- Touch-friendly interface
- Responsive navigation

### 🎨 **Modern UI**
- Clean, professional design
- Tailwind CSS for consistent styling
- Font Awesome icons
- Smooth animations and transitions

### 📊 **Dashboard**
- Revenue statistics
- Order counts
- Product overview
- Recent orders table

### 🛒 **Order Management**
- Create orders with multiple items
- View order details and timeline
- Delete orders with confirmation
- Real-time total calculation

### 📦 **Product Catalog**
- Browse all menu items
- Organized by categories
- Price and description display
- Product statistics

### 🔄 **Real-time Updates**
- Auto-refresh dashboard stats
- Toast notifications
- Loading states
- Error handling

## 🎯 **Why This Approach?**

### ✅ **Advantages:**
- **Simple**: One server, one codebase
- **Fast**: Server-rendered HTML loads instantly
- **Reliable**: No complex build processes
- **SEO-friendly**: Search engines love server-rendered content
- **Easy to deploy**: Single Node.js application
- **No JavaScript required**: Works even with JS disabled

### 🚀 **Perfect For:**
- Small to medium businesses
- Internal tools
- Rapid prototyping
- Teams that prefer simplicity
- Projects that need to "just work"

## 🛠 **Development**

### **Hot Reload**
The server automatically restarts when you change TypeScript files:
```bash
npm run dev
```

### **Database Changes**
After modifying `prisma/schema.prisma`:
```bash
npm run db:push
npm run db:generate
```

### **Adding New Pages**
1. Create EJS template in `views/`
2. Add route in `src/routes/web.ts`
3. Add navigation link in `views/layout.ejs`

### **Adding API Endpoints**
1. Add route in appropriate file (`products.ts`, `orders.ts`, etc.)
2. Use Zod for input validation
3. Return JSON responses

## 📱 **Mobile Features**

- **Touch-friendly buttons** - Large tap targets
- **Responsive tables** - Horizontal scroll on small screens
- **Mobile navigation** - Collapsible menu
- **Optimized forms** - Easy input on mobile devices

## 🎨 **Styling**

### **Tailwind CSS**
- Utility-first CSS framework
- Responsive design built-in
- Consistent spacing and colors
- Easy to customize

### **Custom CSS**
- Additional styles in `public/css/style.css`
- Animations and transitions
- Print styles
- Accessibility improvements

## 🔒 **Security**

- **Input validation** with Zod schemas
- **SQL injection protection** via Prisma ORM
- **XSS protection** through EJS escaping
- **CORS configuration** for API endpoints

## 📈 **Performance**

- **Server-side rendering** for fast initial load
- **Static asset caching** for CSS/JS files
- **Database connection pooling** via Prisma
- **Optimized queries** with proper indexing

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
npm start
```

### **Environment Variables**
```env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=production
```

### **Deploy Anywhere**
- **Heroku** - Add Postgres addon
- **Railway** - Built-in database
- **DigitalOcean** - App Platform
- **AWS** - Elastic Beanstalk
- **Any VPS** - PM2 process manager

## 🎉 **Ready to Use!**

This is a **complete, production-ready** cafe order management system. No complex setup, no build processes, no framework fatigue. Just a solid, reliable web application that works.

**Start the server and you're ready to manage orders!** 🚀
