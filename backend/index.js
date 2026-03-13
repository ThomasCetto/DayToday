import express, { json } from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import taskInstanceRoutes from "./routes/taskInstanceRoutes.js";
import googleRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import wordRoutes from "./routes/wordRoutes.js";
import cookieParser from 'cookie-parser';



const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

connectDB();

app.use("/api/tasks", taskRoutes);
app.use("/api/taskInstances", taskInstanceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth/google", googleRoutes);
app.use("/api/words", wordRoutes);



// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});