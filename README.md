# GameHorde - Video Game Collection Management System

A full-stack application for managing video game collections, inspired by Discogs but tailored for video games. Users can catalog their games, track their collection value, buy/sell games in the marketplace, and connect with other collectors.

## Features

- **Game Catalog**: Browse and search thousands of video games across all platforms
- **Collection Management**: Track your games with condition, completeness, and purchase details
- **Wishlist**: Keep track of games you want to add to your collection
- **Marketplace**: Buy and sell games with other collectors
- **User Profiles**: View other collectors' collections and reputation
- **Collection Statistics**: Track the total value and breakdown of your collection

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- RESTful API design

### Frontend
- React with TypeScript
- Material-UI components
- React Query for data fetching
- React Router for navigation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gamehorde.git
cd gamehorde
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gamehorde
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start MongoDB (if running locally)

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. In a new terminal, start the frontend:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Games
- `GET /api/games` - Get all games (with pagination and filters)
- `GET /api/games/:id` - Get single game
- `POST /api/games` - Add new game (authenticated)
- `PUT /api/games/:id` - Update game (authenticated)

### Collections
- `POST /api/collections/add` - Add game to collection
- `PUT /api/collections/item/:itemId` - Update collection item
- `DELETE /api/collections/item/:itemId` - Remove from collection
- `POST /api/collections/wishlist/add` - Add to wishlist
- `DELETE /api/collections/wishlist/:itemId` - Remove from wishlist
- `GET /api/collections/stats` - Get collection statistics

### Marketplace
- `GET /api/marketplace` - Get all listings
- `GET /api/marketplace/:id` - Get single listing
- `POST /api/marketplace` - Create listing (authenticated)
- `PUT /api/marketplace/:id` - Update listing (authenticated)
- `POST /api/marketplace/:id/offer` - Make offer (authenticated)

## License

MIT