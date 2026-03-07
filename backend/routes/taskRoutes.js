import express from "express";
import { createTask, getTask, deleteTask, patchTask } from "../controllers/taskController.js";
import { requireAuth } from "../middleware/requireAuth.js";


const router = express.Router();

router.use(requireAuth);  // Middleware for JWT


router.post("/", createTask);
router.get("/:id", getTask);
router.delete("/:id", deleteTask);
router.patch("/:id", patchTask);

export default router;