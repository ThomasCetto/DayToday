import express, { json } from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();


// Middleware
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/tasks", taskRoutes);



// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});