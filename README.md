# UserHub - Complete User Management System

A full-stack web application with React frontend and Node.js backend featuring comprehensive user management, authentication, and role-based access control.

## 🚀 Features

### Backend Features

- **JWT Authentication** with access and refresh tokens
- **Email Verification** with nodemailer
- **Password Reset** functionality
- **Google OAuth** integration
- **Role-Based Access Control** (Admin/User)
- **File Upload** with Multer (profile images)
- **Input Validation** with express-validator
- **Rate Limiting** for API protection
- **Redis Caching** for improved performance
- **MySQL Database** with Sequelize ORM
- **RESTful API** design

### Frontend Features

- **React 19** with modern hooks
- **React Router** for navigation
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Responsive Design** for all devices
- **Image Upload** with preview
- **Real-time Form Validation**
- **Search and Pagination**
- **Toast Notifications**
- **Loading States** and error handling
- **Protected Routes**

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MySQL + Sequelize
- Redis
- JWT
- Nodemailer
- Multer
- Passport (Google OAuth)
- bcryptjs
- express-validator

### Frontend

- React 19
- Vite
- React Router DOM
- React Hook Form
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React (Icons)
- js-cookie

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- Redis server
- Gmail account for email services

### Backend Setup

1. **Clone and navigate to backend**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

4. **Configure .env file**

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=user_management
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=15m
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   JWT_REFRESH_EXPIRE=7d

   # Session Secret
   SESSION_SECRET=your_session_secret_here

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=

   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

4. **Configure .env file**

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_APP_NAME=UserHub
   VITE_APP_VERSION=1.0.0
   ```

5. **Start the frontend server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

1. **Create MySQL database**

   ```sql
   CREATE DATABASE user_management;
   ```

2. **Database tables will be created automatically** when you start the backend server (Sequelize auto-sync).

## 📧 Email Configuration

1. **Enable 2-Factor Authentication** in your Gmail account
2. **Generate App Password** for your application
3. **Use the App Password** in your `.env` file

## 🔐 Google OAuth Setup

1. **Go to Google Cloud Console**
2. **Create a new project** or select existing
3. **Enable Google+ API**
4. **Create OAuth 2.0 credentials**
5. **Add authorized redirect URIs**:
   - `http://localhost:5000/api/v1/auth/google/callback`
6. **Copy Client ID and Secret** to your `.env` file

## 🚦 API Endpoints

### Authentication

- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - Login user
- `POST /api/v1/user/logout` - Logout user
- `GET /api/v1/user/verify-email` - Verify email
- `POST /api/v1/user/forgot-password` - Request password reset
- `POST /api/v1/user/reset-password` - Reset password
- `POST /api/v1/user/refresh-token` - Refresh access token

### Users

- `GET /api/v1/user/` - Get all users (paginated)
- `GET /api/v1/user/me` - Get current user
- `GET /api/v1/user/:id` - Get user by ID
- `PUT /api/v1/user/profile` - Update user profile
- `DELETE /api/v1/user/:id` - Delete user (Admin only)

### OAuth

- `GET /api/v1/auth/google` - Google OAuth login
- `GET /api/v1/auth/google/callback` - Google OAuth callback

## 🎨 Pages & Components

### Pages

- **Home** - Landing page with features
- **Login** - User authentication
- **Register** - User registration with image upload
- **Dashboard** - Users listing with search and pagination
- **Profile** - User profile management
- **Forgot Password** - Password reset request
- **Reset Password** - Password reset form
- **Email Verification** - Email verification handling

### Components

- **Layout** - Main application layout
- **Navbar** - Navigation component
- **ProtectedRoute** - Route protection
- **UserCard** - User display component
- **ImageUpload** - File upload with preview
- **SearchBar** - Search functionality
- **Pagination** - Page navigation
- **Modal** - Reusable modal component
- **Button, Input, Loading** - UI components

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS Protection**
- **Helmet** for security headers
- **File Upload Validation**
- **Role-Based Access Control**

## 📱 Responsive Design

The application is fully responsive and works perfectly on:

- **Desktop** computers
- **Tablets** (iPad, Android tablets)
- **Mobile** devices (iPhone, Android phones)

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secrets
4. Configure production email service
5. Deploy to your preferred platform (Heroku, DigitalOcean, AWS, etc.)

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, email support@userhub.com or join our Slack channel.

---

**Built with ❤️ using React and Node.js**
