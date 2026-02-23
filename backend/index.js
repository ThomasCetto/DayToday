import express, { json } from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import taskInstanceRoutes from "./routes/taskInstanceRoutes.js";

const app = express();


// Middleware
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/tasks", taskRoutes);
app.use("/api/taskInstances", taskInstanceRoutes);



// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});