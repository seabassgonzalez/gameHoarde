const { eventBus, EVENTS } = require('../eventBus');
const { addAnalyticsJob } = require('../../queues');
const { logger } = require('../../utils/logger');

// Analytics aggregation handler
class AnalyticsHandler {
  constructor() {
    this.registerHandlers();
    this.aggregationBuffer = new Map();
    this.flushInterval = 60000; // 1 minute
    this.startAggregation();
  }

  registerHandlers() {
    // User analytics
    eventBus.onIdempotent(EVENTS.USER_LOGIN, this.handleUserLogin.bind(this));
    eventBus.onIdempotent(EVENTS.USER_CREATED, this.handleUserCreated.bind(this));
    
    // Game analytics
    eventBus.onIdempotent(EVENTS.GAME_VIEWED, this.handleGameViewed.bind(this));
    eventBus.onIdempotent(EVENTS.GAME_ADDED_TO_COLLECTION, this.handleGameAdded.bind(this));
    
    // Search analytics
    eventBus.onIdempotent(EVENTS.SEARCH_PERFORMED, this.handleSearch.bind(this));
  }

  async handleUserLogin(data) {
    await this.bufferMetric('user.logins', {
      userId: data.userId,
      timestamp: data.timestamp,
      ip: data.ip,
      userAgent: data.userAgent
    });
  }

  async handleUserCreated(data) {
    await this.bufferMetric('user.registrations', {
      userId: data.userId,
      timestamp: data.timestamp,
      source: data.source || 'web'
    });
  }

  async handleGameViewed(data) {
    await this.bufferMetric('game.views', {
      gameId: data.gameId,
      userId: data.userId,
      timestamp: data.timestamp,
      referrer: data.referrer
    });
    
    // Increment game popularity counter
    await this.incrementCounter(`game:${data.gameId}:views`);
  }

  async handleGameAdded(data) {
    await this.bufferMetric('collection.additions', {
      gameId: data.gameId,
      userId: data.userId,
      timestamp: data.timestamp,
      platform: data.platform
    });
  }

  async handleSearch(data) {
    await this.bufferMetric('searches', {
      query: data.query,
      userId: data.userId,
      timestamp: data.timestamp,
      resultCount: data.resultCount
    });
    
    // Track popular search terms
    await this.incrementCounter(`search:${data.query.toLowerCase()}`);
  }

  // Buffer metrics for batch processing
  async bufferMetric(metricName, data) {
    if (!this.aggregationBuffer.has(metricName)) {
      this.aggregationBuffer.set(metricName, []);
    }
    
    this.aggregationBuffer.get(metricName).push(data);
    
    // Force flush if buffer is too large
    if (this.aggregationBuffer.get(metricName).length > 1000) {
      await this.flushMetric(metricName);
    }
  }

  // Increment counter (eventually consistent)
  async incrementCounter(key, amount = 1) {
    if (!this.counters) {
      this.counters = new Map();
    }
    
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + amount);
  }

  // Periodic flush of aggregated data
  startAggregation() {
    setInterval(async () => {
      await this.flushAllMetrics();
    }, this.flushInterval);
  }

  async flushAllMetrics() {
    const metrics = Array.from(this.aggregationBuffer.entries());
    
    for (const [metricName, data] of metrics) {
      await this.flushMetric(metricName);
    }
    
    // Flush counters
    if (this.counters && this.counters.size > 0) {
      await addAnalyticsJob({
        type: 'counters',
        data: Object.fromEntries(this.counters),
        timestamp: new Date()
      });
      
      this.counters.clear();
    }
  }

  async flushMetric(metricName) {
    const data = this.aggregationBuffer.get(metricName);
    
    if (!data || data.length === 0) {
      return;
    }
    
    try {
      // Send to analytics processing queue
      await addAnalyticsJob({
        type: 'metrics',
        metricName,
        data,
        count: data.length,
        timestamp: new Date()
      });
      
      // Clear buffer
      this.aggregationBuffer.set(metricName, []);
      
      logger.info(`Flushed ${data.length} ${metricName} metrics`);
      
    } catch (error) {
      logger.error(`Failed to flush ${metricName} metrics:`, error);
    }
  }
}

// Create singleton instance
const analyticsHandler = new AnalyticsHandler();

module.exports = analyticsHandler;