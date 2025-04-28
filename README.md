# Feuerwehr-TV Platform Backend

Backend API for the Feuerwehr-TV Platform built with Node.js, Express, and MongoDB.

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd firestation
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory based on `.env.example`
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration values

5. Start the development server
```bash
npm run dev
```

## Required Packages

### Production Dependencies
- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling
- **dotenv**: Environment variable management
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation for authentication
- **cors**: Cross-Origin Resource Sharing middleware
- **helmet**: Security headers middleware
- **morgan**: HTTP request logger
- **express-rate-limit**: Rate limiting middleware
- **nodemailer**: Email sending functionality

### Development Dependencies
- **nodemon**: Development server with auto-restart
- **jest**: Testing framework
- **supertest**: HTTP testing library
- **mongodb-memory-server**: In-memory MongoDB for testing
- **@babel/core**: Babel core for ES6+ support
- **@babel/preset-env**: Babel preset for latest JavaScript
- **babel-jest**: Babel integration for Jest

## Install Command

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet morgan express-rate-limit nodemailer

npm install --save-dev nodemon jest supertest mongodb-memory-server @babel/core @babel/preset-env babel-jest
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get token
- `GET /api/auth/me` - Get current user profile (protected)
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password with token

## Testing

Run tests with:
```bash
npm test
```

## Project Structure

```
firestation/
├── config/
│   └── db.js            # Database connection
├── controllers/
│   └── authController.js # Auth controller functions
├── middleware/
│   └── authMiddleware.js # Auth middleware (JWT verification)
├── models/
│   └── User.js          # User model
├── routes/
│   └── authRoutes.js    # Auth routes
├── services/
│   └── authService.js   # Auth business logic
├── tests/
│   └── auth.test.js     # Auth tests
├── utils/
│   └── emailSender.js   # Email utility
├── .env.example         # Example environment variables
├── babel.config.js      # Babel configuration
├── package.json         # Project dependencies
└── server.js            # Application entry point
```
