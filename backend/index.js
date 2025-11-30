import express, { json } from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";

const app = express();


// Middleware
app.use(cors());
app.use(json());

connectDB();



// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});