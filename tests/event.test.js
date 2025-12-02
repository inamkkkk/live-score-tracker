const request = require('supertest');
const { app, server } = require('../server');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

// Mock user for authentication
const mockUser = {
    username: 'testuser',
    password: 'password123'
};

let authToken;

beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Register the mock user
    const registrationResponse = await request(app)
        .post('/api/auth/register')
        .send(mockUser);

    expect(registrationResponse.status).toBe(201);

    // Login the mock user to get the auth token
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(mockUser);

    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.token;
});

afterEach(async () => {
    // Clean up the test database after each test
    await Event.deleteMany({});
});

afterAll(async () => {
    // Disconnect from the test database
    await mongoose.connection.close();
    server.close(); // Close the server after all tests
});

describe('Event API Endpoints', () => {
    it('should create a new event', async () => {
        const res = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Test Event',
                team1: 'Team A',
                team2: 'Team B'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toEqual('Test Event');
    });

    it('should get all events', async () => {
        // Create a test event first
        await Event.create({
            name: 'Test Event',
            team1: 'Team A',
            team2: 'Team B',
            score: { team1: 0, team2: 0 }
        });

        const res = await request(app)
            .get('/api/events')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
    });

    it('should get an event by id', async () => {
        const event = await Event.create({
            name: 'Test Event',
            team1: 'Team A',
            team2: 'Team B',
            score: { team1: 0, team2: 0 }
        });

        const res = await request(app)
            .get(`/api/events/${event._id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('Test Event');
    });

    it('should update an event', async () => {
        const event = await Event.create({
            name: 'Test Event',
            team1: 'Team A',
            team2: 'Team B',
            score: { team1: 0, team2: 0 }
        });

        const res = await request(app)
            .put(`/api/events/${event._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Updated Event',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('Updated Event');
    });

    it('should delete an event', async () => {
        const event = await Event.create({
            name: 'Test Event',
            team1: 'Team A',
            team2: 'Team B',
            score: { team1: 0, team2: 0 }
        });

        const res = await request(app)
            .delete(`/api/events/${event._id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Event deleted successfully');
    });

    it('should update event score', async () => {
       const event = await Event.create({
            name: 'Test Event',
            team1: 'Team A',
            team2: 'Team B',
            score: { team1: 0, team2: 0 }
        });

        const res = await request(app)
            .put(`/api/events/${event._id}/score`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
               score: {team1: 1, team2: 2}
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.score.team1).toEqual(1);
        expect(res.body.score.team2).toEqual(2);
    });
});