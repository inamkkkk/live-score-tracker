const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const { authenticate } = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
      origin: '*', // Allow all origins for development.  Consider restricting in production.
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/livescore';

app.use(cors());
app.use(express.json());

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Live Score Tracker API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/events', authenticate, eventRoutes);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.set('socketio', io); // Make io instance available in app

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { app, server }; // For testing