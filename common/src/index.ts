import dotenv from 'dotenv';
dotenv.config();

// Configs
export * from './config/db';
export { log } from './config/logger';
export {oauth2Client} from './config/googleAuth';


// Error handlers
export * from './errorHandler/ApiError';
export * from './errorHandler/error-converter';
export * from './errorHandler/error-handler';

// Common DBLayer
export * from './utils/dbService/dbService';

// Common Utilis
export * from './utils/bcrypt/Bcrypt';
export * from './utils/jwt/Jwt';

// Auth middlewares
export * from './middlewares/authMiddleware/authMiddleware';

