// server/config/db.js

import mongoose from 'mongoose'; // 1. Import Mongoose

const connectDB = async () => {
    // 2. The connection string is accessed via process.env.MONGO_URI
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ ERROR: MONGO_URI is not defined in the environment variables.");
        // If URI is missing, we must exit or fallback to mock data (for this example, we'll exit)
        // process.exit(1); 
        
        // For now, continuing with the stub to keep the server running
        console.log("Database connection stub run. MONGO_URI missing. Using in-memory mock data.");
        return;
    }

    try {
        // 3. Connect to MongoDB using the provided URI
        const conn = await mongoose.connect(uri, {
            // Recommended Mongoose connection options
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            // Note: useCreateIndex and useFindAndModify are now default/deprecated in recent Mongoose versions
        });
        
        console.log(`✅ MongoDB Connected Successfully! Host: ${conn.connection.host}`);
        
        // 🚨 IMPORTANT: You must now update your controllers to use Mongoose Models 🚨

    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;