const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Game = require('../../models/Game');

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
    res.status(401).json({ error: 'No token provided' });
  }
};

// Apply middleware and routes
app.use(mockAuth);
const collectionsRouter = require('../../routes/collections');
app.use('/api/collections', collectionsRouter);

describe('Collections Routes', () => {
  let authToken;
  let testUser;
  let testGame;

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    // Create test game
    testGame = await Game.create({
      title: 'Test Game',
      platform: 'PlayStation 5',
      developer: 'Test Developer',
    });

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser._id.toString(), role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  });

  describe('POST /api/collections/add', () => {
    it('should add game to collection', async () => {
      const collectionData = {
        gameId: testGame._id.toString(),
        condition: 'Mint',
        completeness: 'CIB',
        notes: 'Test notes',
      };

      const response = await request(app)
        .post('/api/collections/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send(collectionData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('game');
      expect(response.body.condition).toBe('Mint');

      // Verify game was added to user's collection
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.gameCollection).toHaveLength(1);
      expect(updatedUser.gameCollection[0].game.toString()).toBe(testGame._id.toString());
    });

    it('should not add duplicate games to collection', async () => {
      // First add the game
      await User.findByIdAndUpdate(testUser._id, {
        $push: {
          gameCollection: {
            game: testGame._id,
            condition: 'Good',
            completeness: 'Loose',
          },
        },
      });

      // Try to add again
      const response = await request(app)
        .post('/api/collections/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          gameId: testGame._id.toString(),
          condition: 'Mint',
          completeness: 'CIB',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Game already in collection');
    });

    it('should validate game exists', async () => {
      const response = await request(app)
        .post('/api/collections/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          gameId: '507f1f77bcf86cd799439011', // Fake ID
          condition: 'Mint',
          completeness: 'CIB',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Game not found');
    });
  });

  describe('GET /api/collections/stats', () => {
    it('should return collection statistics', async () => {
      // Add games to collection
      await User.findByIdAndUpdate(testUser._id, {
        $push: {
          gameCollection: [
            {
              game: testGame._id,
              condition: 'Mint',
              completeness: 'CIB',
              purchasePrice: 59.99,
            },
            {
              game: await Game.create({
                title: 'Another Game',
                platform: 'Xbox Series X',
                developer: 'Dev',
              }),
              condition: 'Good',
              completeness: 'Complete',
              purchasePrice: 39.99,
            },
          ],
        },
      });

      const response = await request(app)
        .get('/api/collections/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalGames', 2);
      expect(response.body).toHaveProperty('totalValue', 99.98);
      expect(response.body).toHaveProperty('platformBreakdown');
      expect(response.body.platformBreakdown['PlayStation 5']).toBe(1);
      expect(response.body.platformBreakdown['Xbox Series X']).toBe(1);
    });
  });

  describe('POST /api/collections/wishlist/add', () => {
    it('should add game to wishlist', async () => {
      const response = await request(app)
        .post('/api/collections/wishlist/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          gameId: testGame._id.toString(),
          priority: 'High',
          notes: 'Really want this',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('game');
      expect(response.body.priority).toBe('High');

      // Verify game was added to wishlist
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.wishlist).toHaveLength(1);
      expect(updatedUser.wishlist[0].game.toString()).toBe(testGame._id.toString());
    });

    it('should not add duplicate games to wishlist', async () => {
      // First add the game
      await User.findByIdAndUpdate(testUser._id, {
        $push: {
          wishlist: {
            game: testGame._id,
            priority: 'Low',
          },
        },
      });

      // Try to add again
      const response = await request(app)
        .post('/api/collections/wishlist/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          gameId: testGame._id.toString(),
          priority: 'High',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Game already in wishlist');
    });
  });

  describe('DELETE /api/collections/item/:id', () => {
    it('should remove game from collection', async () => {
      // Add game to collection first
      const updatedUser = await User.findByIdAndUpdate(
        testUser._id,
        {
          $push: {
            gameCollection: {
              game: testGame._id,
              condition: 'Mint',
              completeness: 'CIB',
            },
          },
        },
        { new: true }
      );

      const itemId = updatedUser.gameCollection[0]._id;

      const response = await request(app)
        .delete(`/api/collections/item/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('removed from collection');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .delete('/api/collections/item/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found in collection');
    });
  });

  describe('DELETE /api/collections/wishlist/:id', () => {
    it('should remove game from wishlist', async () => {
      // Add game to wishlist first
      const updatedUser = await User.findByIdAndUpdate(
        testUser._id,
        {
          $push: {
            wishlist: {
              game: testGame._id,
              priority: 'High',
            },
          },
        },
        { new: true }
      );

      const itemId = updatedUser.wishlist[0]._id;

      const response = await request(app)
        .delete(`/api/collections/wishlist/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('removed from wishlist');
    });
  });

  describe('PUT /api/collections/item/:id', () => {
    it('should update collection item', async () => {
      // Add game to collection first
      const updatedUser = await User.findByIdAndUpdate(
        testUser._id,
        {
          $push: {
            gameCollection: {
              game: testGame._id,
              condition: 'Good',
              completeness: 'Loose',
            },
          },
        },
        { new: true }
      );

      const itemId = updatedUser.gameCollection[0]._id;

      const response = await request(app)
        .put(`/api/collections/item/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          condition: 'Mint',
          completeness: 'CIB',
          purchasePrice: 49.99,
          notes: 'Updated notes',
        });

      expect(response.status).toBe(200);
      expect(response.body.condition).toBe('Mint');
      expect(response.body.completeness).toBe('CIB');
      expect(response.body.purchasePrice).toBe(49.99);
    });
  });
});