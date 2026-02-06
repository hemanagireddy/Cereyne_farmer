const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const globalErrorHandler = require('./middleware/errorMiddleware');
const identityRoutes = require('./routes/identityRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const AppError = require('./utils/appError');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// MIDDLEWARE
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logging
}

// ROUTES
app.use('/api/v1/identity', identityRoutes);
app.use('/api/v1/inventory', inventoryRoutes);

// Handle undefined routes
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
