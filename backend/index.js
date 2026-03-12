require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const { sequelize } = require('./src/config/db');
require('./src/models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));

app.get('/', (req, res) => {
  res.send('MERN Auth API is running...');
});

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    await connectRedis();
    
    await sequelize.sync({ alter: true });
    
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
