
# Todo Backend API

A RESTful API for managing todos built with Node.js, Express, TypeScript, and MongoDB.

## Features

- ✅ Full CRUD operations for todos
- 🔍 Filter todos by status (all, completed, pending)
- 📊 Todo statistics endpoint
- 🔄 Toggle todo completion status
- 📄 Pagination support
- 🛡️ Input validation and error handling
- 🚀 TypeScript for type safety
- 📝 Comprehensive logging
- 🔒 Security headers with Helmet
- 🌐 CORS enabled
- 🍃 MongoDB with Mongoose ODM

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)

## Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd todo-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```

4. Configure your MongoDB connection in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app?retryWrites=true&w=majority
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. For production build:
   ```bash
   npm run build
   npm start
   ```

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update the `MONGODB_URI` in your `.env` file

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Update `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todo-app
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run build:watch` - Build in watch mode
- `npm run clean` - Clean build directory

## API Endpoints

### Base URL
```
http://localhost:3001/api/todos
```

### Health Check
- **GET** `/health` - Check API health status and database connection

### Todo Endpoints

#### Get All Todos
- **GET** `/api/todos`
- **Query Parameters:**
  - `status` (optional): `all` | `completed` | `pending`
- **Response:** Array of todos with count

#### Get Paginated Todos
- **GET** `/api/todos/paginated`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
  - `status` (optional): `all` | `completed` | `pending`
- **Response:** Paginated todos with pagination metadata

#### Get Todo by ID
- **GET** `/api/todos/:id`
- **Response:** Single todo object

#### Create Todo
- **POST** `/api/todos`
- **Body:**
  ```json
  {
    "title": "Todo title",
    "description": "Optional description"
  }
  ```
- **Response:** Created todo object

#### Update Todo
- **PUT** `/api/todos/:id`
- **Body:**
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "completed": true
  }
  ```
- **Response:** Updated todo object

#### Toggle Todo Status
- **PATCH** `/api/todos/:id/toggle`
- **Response:** Todo with toggled completion status

#### Delete Todo
- **DELETE** `/api/todos/:id`
- **Response:** Success message

#### Get Todo Statistics
- **GET** `/api/todos/stats`
- **Response:** 
  ```json
  {
    "success": true,
    "data": {
      "total": 10,
      "completed": 5,
      "pending": 5
    }
  }
  ```

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message",
  "count": "Optional count for arrays"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Todo Object Structure

```json
{
  "id": "mongodb-objectid",
  "title": "Todo title",
  "description": "Optional description",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `MONGODB_URI` - MongoDB connection string
- `DB_NAME` - Database name (default: todo-app)

## Error Handling

The API includes comprehensive error handling:
- Input validation with Mongoose schema validation
- MongoDB ObjectId validation
- 404 errors for missing resources
- 500 errors for server issues
- Detailed error messages in development mode

## Architecture

```
src/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── models/         # Mongoose models
├── routes/         # Route definitions
├── services/       # Business logic
├── types/          # TypeScript interfaces
└── server.ts       # Application entry point
```

## Data Storage

Uses MongoDB with Mongoose ODM for:
- Document-based storage
- Schema validation
- Indexing for performance
- Automatic timestamps
- Data transformation

## Testing the API

Once your server is running with MongoDB connected, you can test with:

```bash
# Health check
curl http://localhost:3001/health

# Create a todo
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "My first todo", "description": "Test todo"}'

# Get all todos
curl http://localhost:3001/api/todos

# Get paginated todos
curl "http://localhost:3001/api/todos/paginated?page=1&limit=5"

# Get statistics
curl http://localhost:3001/api/todos/stats
```

## License

MIT 
