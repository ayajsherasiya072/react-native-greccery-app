import fastify from 'fastify';
import { connectDB } from './src/config/db.js';
import dotenv from 'dotenv';


dotenv.config();

const start = async () => {
    try {
        await connectDB();

        const app = fastify();
        const PORT = process.env.PORT || 3000;

        await app.listen({ port: PORT, host: '0.0.0.0' });

        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
};

start();
