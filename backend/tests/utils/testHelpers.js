const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Game = require('../../models/Game');

const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpassword123',
    profile: {
      displayName: 'Test User',
      bio: 'Test bio',
      location: 'Test City',
    },
    ...overrides,
  };

  const user = new User(defaultUser);
  await user.save();
  
  return user;
};

const createTestGame = async (overrides = {}) => {
  const defaultGame = {
    title: 'Test Game',
    platform: 'PlayStation 5',
    developer: 'Test Developer',
    publisher: 'Test Publisher',
    releaseDate: new Date('2023-01-01'),
    genres: ['Action', 'Adventure'],
    description: 'Test game description',
    coverImage: 'https://example.com/cover.jpg',
    ...overrides,
  };

  const game = new Game(defaultGame);
  await game.save();
  
  return game;
};

const generateAuthToken = (userId, role = 'user') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1d' }
  );
};

const authenticatedRequest = (request, token) => {
  return request.set('Authorization', `Bearer ${token}`);
};

module.exports = {
  createTestUser,
  createTestGame,
  generateAuthToken,
  authenticatedRequest,
};