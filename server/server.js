const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

dotenv.config({ path: './.env' }); // Ensure .env is loaded from server directory
connectDB();
const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    : ['http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Request from this origin is not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/projects', require('./routes/project.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.get('/api/v1/health', (req, res) => res.status(200).json({ success: true, message: 'API is healthy' }));

app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => res.send('API Dev Mode - Frontend on Port 3000'));
}

const PORT = process.env.PORT || 5000;
const serverInstance = app.listen(PORT, () => console.log(`Server in ${process.env.NODE_ENV} on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    // serverInstance.close(() => process.exit(1));
});