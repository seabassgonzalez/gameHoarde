const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const Game = require('../../models/Game');
const User = require('../../models/User');

// Create test app
const app = express();
app.use(express.json());

// Mock auth middleware
const mockAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    next();
  }
};

// Apply middleware and routes
app.use(mockAuth);
const gamesRouter = require('../../routes/games');
app.use('/api/games', gamesRouter);

describe('Games Routes', () => {
  let authToken;
  let adminToken;
  let testUser;
  let adminUser;

  beforeEach(async () => {
    // Create test users
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpass123',
      role: 'admin',
    });

    // Generate tokens
    authToken = jwt.sign(
      { userId: testUser._id.toString(), role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    adminToken = jwt.sign(
      { userId: adminUser._id.toString(), role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  });

  describe('GET /api/games', () => {
    it('should return paginated games list', async () => {
      // Create test games
      await Game.create([
        { title: 'Game 1', platform: 'PlayStation 5', developer: 'Dev 1' },
        { title: 'Game 2', platform: 'Xbox Series X', developer: 'Dev 2' },
        { title: 'Game 3', platform: 'Nintendo Switch', developer: 'Dev 3' },
      ]);

      const response = await request(app)
        .get('/api/games')
        .query({ page: 1, limit: 2 });

      expect(response.status).toBe(200);
      expect(response.body.games).toHaveLength(2);
      expect(response.body.totalPages).toBe(2);
      expect(response.body.currentPage).toBe('1');
      expect(response.body.totalGames).toBe(3);
    });

    it('should filter games by platform', async () => {
      await Game.create([
        { title: 'PS5 Game', platform: 'PlayStation 5', developer: 'Sony' },
        { title: 'Xbox Game', platform: 'Xbox Series X', developer: 'Microsoft' },
      ]);

      const response = await request(app)
        .get('/api/games')
        .query({ platform: 'PlayStation 5' });

      expect(response.status).toBe(200);
      expect(response.body.games).toHaveLength(1);
      expect(response.body.games[0].title).toBe('PS5 Game');
    });

    it('should search games by text', async () => {
      // Create index for text search
      await Game.createIndexes();
      
      await Game.create([
        { title: 'The Legend of Zelda', platform: 'Nintendo Switch', developer: 'Nintendo' },
        { title: 'Mario Kart', platform: 'Nintendo Switch', developer: 'Nintendo' },
        { title: 'Halo', platform: 'Xbox Series X', developer: 'Bungie' },
      ]);

      const response = await request(app)
        .get('/api/games')
        .query({ search: 'Zelda' });

      expect(response.status).toBe(200);
      expect(response.body.games.length).toBeGreaterThan(0);
      expect(response.body.games[0].title).toContain('Zelda');
    });

    it('should sort games', async () => {
      await Game.create([
        { title: 'C Game', platform: 'PC', developer: 'Dev' },
        { title: 'A Game', platform: 'PC', developer: 'Dev' },
        { title: 'B Game', platform: 'PC', developer: 'Dev' },
      ]);

      const response = await request(app)
        .get('/api/games')
        .query({ sortBy: 'title', order: 'asc' });

      expect(response.status).toBe(200);
      expect(response.body.games[0].title).toBe('A Game');
      expect(response.body.games[1].title).toBe('B Game');
      expect(response.body.games[2].title).toBe('C Game');
    });
  });

  describe('GET /api/games/:id', () => {
    it('should return a single game by ID', async () => {
      const game = await Game.create({
        title: 'Test Game',
        platform: 'PlayStation 5',
        developer: 'Test Dev',
      });

      const response = await request(app)
        .get(`/api/games/${game._id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Game');
      expect(response.body._id).toBe(game._id.toString());
    });

    it('should return 404 for non-existent game', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/games/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('POST /api/games', () => {
    it('should create a new game when authenticated', async () => {
      const gameData = {
        title: 'New Game',
        platform: 'PlayStation 5',
        developer: 'New Developer',
        genres: ['Action', 'RPG'],
        description: 'A new game description',
      };

      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(gameData.title);
      expect(response.body.platform).toBe(gameData.platform);
      expect(response.body.metadata.userSubmitted).toBe(true);
    });

    it('should prevent duplicate games', async () => {
      const gameData = {
        title: 'Duplicate Game',
        platform: 'PlayStation 5',
        developer: 'Dev',
      };

      // Create first game
      await Game.create(gameData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing required fields
          developer: 'Some Dev',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/games')
        .send({
          title: 'Test',
          platform: 'PC',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/games/:id', () => {
    it('should update game when user is admin', async () => {
      const game = await Game.create({
        title: 'Original Title',
        platform: 'PlayStation 5',
        developer: 'Original Dev',
      });

      const response = await request(app)
        .put(`/api/games/${game._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Title',
          description: 'Updated description',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.description).toBe('Updated description');
    });

    it('should update game when user is original submitter', async () => {
      const game = await Game.create({
        title: 'User Game',
        platform: 'PC',
        developer: 'User Dev',
        metadata: {
          addedBy: testUser._id,
          userSubmitted: true,
        },
      });

      const response = await request(app)
        .put(`/api/games/${game._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated by User',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated by User');
    });

    it('should not allow non-admin to update others games', async () => {
      const otherUser = await User.create({
        username: 'otheruser',
        email: 'other@example.com',
        password: 'password123',
      });

      const game = await Game.create({
        title: 'Other User Game',
        platform: 'PC',
        developer: 'Dev',
        metadata: {
          addedBy: otherUser._id,
          userSubmitted: true,
        },
      });

      const response = await request(app)
        .put(`/api/games/${game._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Trying to Update',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/games/:id', () => {
    it('should delete game when user is admin', async () => {
      const game = await Game.create({
        title: 'Game to Delete',
        platform: 'PC',
        developer: 'Dev',
      });

      const response = await request(app)
        .delete(`/api/games/${game._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted');

      // Verify game is deleted
      const deletedGame = await Game.findById(game._id);
      expect(deletedGame).toBeNull();
    });

    it('should not allow non-admin to delete games', async () => {
      const game = await Game.create({
        title: 'Protected Game',
        platform: 'PC',
        developer: 'Dev',
      });

      const response = await request(app)
        .delete(`/api/games/${game._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
    });
  });
});