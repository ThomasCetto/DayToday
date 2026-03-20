import express from "express";
import { patchTaskInstance, getTaskInstance, deleteTaskInstance, getTasksFromRange } from "../controllers/taskInstanceController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireApiKey } from "../middleware/requireApiKey.js";



const router = express.Router();

router.use(requireAuth);  // Middleware for JWT
router.use(requireApiKey);  // Middleware for api key

router.get("/:id", getTaskInstance);
router.delete("/:id", deleteTaskInstance);
router.patch("/:id", patchTaskInstance);

router.get("/", getTasksFromRange);

export default router;