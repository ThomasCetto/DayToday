import express from "express";
import { createTask, getTask, deleteTask, putTask, getOngoingTasks } from "../controllers/taskController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireApiKey } from "../middleware/requireApiKey.js";


const router = express.Router();

router.use(requireAuth);  // Middleware for JWT
router.use(requireApiKey);  // Middleware for api key


router.post("/", createTask);
router.get("/:id", getTask);
router.delete("/:id", deleteTask);
router.put("/:id", putTask);
router.get("/", getOngoingTasks);

export default router;