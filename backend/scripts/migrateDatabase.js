const mongoose = require('mongoose');

async function migrateDatabase() {
  try {
    // Connect to MongoDB
    const connection = await mongoose.connect('mongodb://localhost:27017/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Get admin access
    const admin = connection.connection.db.admin();
    
    // List all databases
    const { databases } = await admin.listDatabases();
    
    // Check if gamehoard exists
    const gameHoardExists = databases.some(db => db.name === 'gamehoard');
    
    if (gameHoardExists) {
      console.log('Found gamehoard database. Starting migration...');
      
      // Connect to the old database
      const oldDb = connection.connection.useDb('gamehoard').db;
      const newDb = connection.connection.useDb('gamehorde').db;
      
      // Get all collections from old database
      const collections = await oldDb.listCollections().toArray();
      
      // Copy each collection
      for (const collInfo of collections) {
        const collectionName = collInfo.name;
        console.log(`Copying collection: ${collectionName}`);
        
        const oldCollection = oldDb.collection(collectionName);
        const newCollection = newDb.collection(collectionName);
        
        // Get all documents
        const documents = await oldCollection.find({}).toArray();
        
        if (documents.length > 0) {
          // Insert all documents into new collection
          await newCollection.insertMany(documents);
          console.log(`  Copied ${documents.length} documents`);
        } else {
          console.log(`  No documents to copy`);
        }
      }
      
      console.log('\nMigration complete!');
      console.log('The old database (gamehoard) has been preserved.');
      console.log('You can now use the new database (gamehorde).');
      console.log('\nTo remove the old database, run:');
      console.log('  mongo gamehoard --eval "db.dropDatabase()"');
      
    } else {
      console.log('No gamehoard database found. Nothing to migrate.');
    }
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
console.log('Starting database migration from gamehoard to gamehorde...\n');
migrateDatabase();