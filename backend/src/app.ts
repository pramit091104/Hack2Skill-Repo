import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

// Define Routes imports (to be created)
import userRoutes from './routes/user.routes';
import mealRoutes from './routes/meal.routes';
import uploadRoutes from './routes/upload.routes';
import aiRoutes from './routes/ai.routes';
import habitRoutes from './routes/habit.routes';

const app: Express = express();

// Trust Cloud Run / GCP load balancer proxy
app.set('trust proxy', 1);

// 1. Security & Standard Middlewares
app.use(helmet());
app.use(cors({ origin: '*' })); // Limit this to Firebase Hosting origin in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Rate Limiting (Global)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// 3. Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'NutriSmart AI Backend is running' });
});

// 4. API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/meals', mealRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/habits', habitRoutes);

// 5. Swagger API Documentation
try {
  const swaggerFile = fs.readFileSync(path.join(__dirname, '../swagger.yaml'), 'utf8');
  const swaggerDocument = yaml.parse(swaggerFile);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.warn('Swagger YAML file not found or invalid. Docs will not be available.');
}

// 6. Global Error Handling
app.use(errorMiddleware);

export default app;
