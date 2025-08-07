const EventEmitter = require('events');
const Bull = require('bull');
const { logger } = require('../utils/logger');

// Event bus for handling eventual consistency
class EventBus extends EventEmitter {
  constructor() {
    super();
    this.eventQueue = new Bull('events', {
      redis: process.env.REDIS_URL
    });
    this.setupEventProcessing();
  }

  // Emit event locally and to queue
  async emitAsync(eventName, data) {
    // Local emit for immediate handlers
    this.emit(eventName, data);
    
    // Queue for distributed processing
    await this.eventQueue.add(eventName, {
      eventName,
      data,
      timestamp: new Date(),
      version: 1
    });
  }

  // Process queued events
  setupEventProcessing() {
    this.eventQueue.process('*', async (job) => {
      const { eventName, data } = job.data;
      
      try {
        // Emit to local handlers
        this.emit(`queued:${eventName}`, data);
        
        logger.info(`Processed event: ${eventName}`);
        return { processed: true };
        
      } catch (error) {
        logger.error(`Event processing failed: ${eventName}`, error);
        throw error;
      }
    });
  }

  // Register idempotent event handler
  onIdempotent(eventName, handler, options = {}) {
    const wrappedHandler = async (data) => {
      const eventId = data.eventId || `${eventName}-${Date.now()}`;
      
      // Check if already processed
      const processed = await this.checkProcessed(eventId);
      if (processed && !options.allowReplay) {
        logger.debug(`Event ${eventId} already processed, skipping`);
        return;
      }
      
      try {
        await handler(data);
        await this.markProcessed(eventId);
      } catch (error) {
        logger.error(`Handler failed for ${eventName}:`, error);
        throw error;
      }
    };
    
    this.on(eventName, wrappedHandler);
    this.on(`queued:${eventName}`, wrappedHandler);
  }

  // Track processed events
  async checkProcessed(eventId) {
    // In production, use Redis
    // For now, use in-memory set
    return this.processedEvents?.has(eventId) || false;
  }

  async markProcessed(eventId) {
    if (!this.processedEvents) {
      this.processedEvents = new Set();
    }
    this.processedEvents.add(eventId);
  }
}

// Singleton instance
const eventBus = new EventBus();

// Domain events
const EVENTS = {
  // User events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  
  // Game events
  GAME_ADDED: 'game.added',
  GAME_UPDATED: 'game.updated',
  GAME_IMPORTED: 'game.imported',
  
  // Collection events
  GAME_ADDED_TO_COLLECTION: 'collection.game.added',
  GAME_REMOVED_FROM_COLLECTION: 'collection.game.removed',
  
  // Marketplace events
  LISTING_CREATED: 'marketplace.listing.created',
  LISTING_UPDATED: 'marketplace.listing.updated',
  LISTING_SOLD: 'marketplace.listing.sold',
  OFFER_MADE: 'marketplace.offer.made',
  OFFER_ACCEPTED: 'marketplace.offer.accepted',
  
  // Analytics events
  USER_LOGIN: 'analytics.user.login',
  GAME_VIEWED: 'analytics.game.viewed',
  SEARCH_PERFORMED: 'analytics.search.performed'
};

module.exports = { eventBus, EVENTS };