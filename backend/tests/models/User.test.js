const User = require('../../models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  describe('Validation', () => {
    it('should validate required fields', async () => {
      const user = new User({});
      
      let error;
      try {
        await user.validate();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.username).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should validate email format', async () => {
      const user = new User({
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
      });

      let error;
      try {
        await user.validate();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    it('should validate username uniqueness', async () => {
      await User.create({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
      });

      const duplicateUser = new User({
        username: 'existinguser',
        email: 'different@example.com',
        password: 'password123',
      });

      let error;
      try {
        await duplicateUser.save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'mypassword123';
      const user = new User({
        username: 'hashtest',
        email: 'hash@example.com',
        password: plainPassword,
      });

      await user.save();

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });

    it('should not rehash password if not modified', async () => {
      const user = await User.create({
        username: 'nohashtest',
        email: 'nohash@example.com',
        password: 'password123',
      });

      const originalHash = user.password;
      user.profile.bio = 'Updated bio';
      await user.save();

      expect(user.password).toBe(originalHash);
    });
  });

  describe('Methods', () => {
    it('should compare password correctly', async () => {
      const password = 'correctpassword';
      const user = await User.create({
        username: 'comparetest',
        email: 'compare@example.com',
        password: password,
      });

      const isMatch = await bcrypt.compare(password, user.password);
      expect(isMatch).toBe(true);

      const isNotMatch = await bcrypt.compare('wrongpassword', user.password);
      expect(isNotMatch).toBe(false);
    });
  });

  describe('Default Values', () => {
    it('should have default values', () => {
      const user = new User({
        username: 'defaulttest',
        email: 'default@example.com',
        password: 'password123',
      });

      expect(user.profile.displayName).toBeUndefined();
      expect(user.profile.bio).toBeUndefined();
      expect(user.profile.location).toBeUndefined();
      expect(user.gameCollection).toEqual([]);
      expect(user.wishlist).toEqual([]);
      expect(user.reputation.rating).toBe(0);
      expect(user.reputation.totalRatings).toBe(0);
    });
  });
});