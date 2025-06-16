import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import todoRoutes from './routes/todoRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { connectDatabase } from './config/database';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'https://todo-frontend-theta-self.vercel.app',
  'https://todo-frontend-vatspras-projects.vercel.app',
  'http://localhost:5173',
];

// Connect to MongoDB before setting up middleware
const startServer = async () => {
  try {
    // Connect to database first
    await connectDatabase();
    
    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(cors({
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin || '')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }));

    // Logging middleware
    app.use(morgan('combined'));

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Todo API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'Connected'
      });
    });

    // API routes
    app.use('/api/todos', todoRoutes);

    // 404 handler for undefined routes
    app.use(notFoundHandler);

    // Global error handler
    app.use(errorHandler);

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Todo API server is running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 API endpoint: http://localhost:${PORT}/api/todos`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Process terminated');
      });
    });

    process.on('SIGINT', () => {
      console.log('👋 SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Process terminated');
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server with database connection
startServer();

export default app; 