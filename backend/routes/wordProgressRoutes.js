import express from "express";
import { postWordProgress } from "../controllers/wordProgressController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);  // Middleware for JWT

router.post("/", postWordProgress);

export default router;