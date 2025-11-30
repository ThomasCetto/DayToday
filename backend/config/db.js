import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        const PORT = 27017;
        const DB_URL = process.env.DB_URL || `mongodb://localhost:${PORT}/daytoday`;
        await connect(DB_URL);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;