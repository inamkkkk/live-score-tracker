# Live Score Tracker

A real-time service that provides live scores for sports events using WebSockets.

## Features

*   Real-time score updates via WebSockets.
*   REST API for managing sports events and scores.
*   User authentication and authorization.
*   Database integration (MongoDB).

## Technologies Used

*   Node.js
*   Express.js
*   Socket.IO
*   MongoDB
*   JSON Web Tokens (JWT)
*   Mongoose

## Installation

1.  Clone the repository:
    
    git clone <repository_url>
    
2.  Install dependencies:
    
    npm install
    
3.  Configure the environment variables:
    *   Create a `.env` file in the root directory.
    *   Set the following environment variables:
        
        PORT=3000
        MONGODB_URI=<your_mongodb_uri>
        JWT_SECRET=<your_jwt_secret>
        
4.  Run the server:
    
    npm start
    

## API Endpoints

*   `POST /api/auth/register` - Register a new user.
*   `POST /api/auth/login` - Login a user.
*   `GET /api/events` - Get all sports events.
*   `POST /api/events` - Create a new sports event (requires authentication).
*   `GET /api/events/:id` - Get a specific sports event.
*   `PUT /api/events/:id` - Update a sports event (requires authentication).
*   `DELETE /api/events/:id` - Delete a sports event (requires authentication).
*   `PUT /api/events/:id/score` - Update the score of a sports event (requires authentication).

## WebSocket Events

*   `score_update` - Emitted when the score of a sports event is updated.  Data: `{ eventId: string, score: { team1: number, team2: number } }`
*   `new_event` - Emitted when a new sports event is created. Data: `{ event: object }`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT