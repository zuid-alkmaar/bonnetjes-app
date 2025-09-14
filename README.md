# Bonnetjes Cafe - Order Management System

A modern, mobile-responsive cafe order management system with separated frontend and backend architecture. Built with Next.js frontend and Express TypeScript API server.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Express.js TypeScript API server with Prisma ORM
- **Database**: SQLite for local development
- **API**: RESTful endpoints with full CRUD operations
- **Separation**: Clean frontend/backend separation for better scalability

## ✨ Features

- **📱 Mobile Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **📋 Order Management**: Create, view, edit, and delete customer orders
- **🛍️ Product Catalog**: Manage menu items with categories and pricing
- **📊 Dashboard Analytics**: Real-time stats on orders, revenue, and products
- **🎨 Modern UI**: Clean, intuitive interface with Tailwind CSS
- **⚡ Fast Performance**: Built with Next.js 15 and optimized for speed
- **🔒 Type Safe**: Full TypeScript implementation across frontend and backend
- **🔌 RESTful API**: Standalone TypeScript server with comprehensive endpoints

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd bonnetjes-app
   ```

2. **Install dependencies for both frontend and backend:**
   ```bash
   # Frontend dependencies
   npm install

   # Backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up the API server:**
   ```bash
   cd server
   npx prisma db push
   npm run db:seed
   npm run dev
   ```

4. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API Server: [http://localhost:3001](http://localhost:3001)
   - API Health: [http://localhost:3001/health](http://localhost:3001/health)

## 🚀 Deployment

This application is ready for deployment on Vercel with PostgreSQL database support.

### Quick Deployment Steps

1. **Check migration readiness:**
   ```bash
   npm run migrate:check
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Set up environment variables in Vercel dashboard
   - Deploy automatically

3. **Set up database:**
   - Create a Supabase project
   - Configure environment variables
   - Run database migrations



## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Prisma ORM
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Database**: Local SQLite file

## 📱 Mobile Responsive Design

The application is fully optimized for mobile devices with:

- Responsive navigation with hamburger menu
- Touch-friendly controls and buttons
- Adaptive layouts for all screen sizes
- Optimized typography and spacing
- Fast loading on mobile networks

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:seed` - Seed database with sample data
- `npm run db:push` - Push schema changes to database
- `npm run migrate:check` - Check PostgreSQL migration readiness

## 📊 Features Overview

### Dashboard
- Real-time order statistics
- Revenue tracking
- Product inventory overview
- Recent orders list

### Order Management
- Create new orders with product selection
- View and edit existing orders
- Delete orders with confirmation
- Customer name tracking

### Product Management
- Add/edit/delete products
- Category organization
- Price management
- Product descriptions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For deployment issues or questions, check:
- [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
