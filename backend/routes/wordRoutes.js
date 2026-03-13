import express from "express";
import { addWords } from "../controllers/wordController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);  // Middleware for JWT

router.post("/", addWords);

export default router;