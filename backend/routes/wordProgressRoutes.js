import express from "express";
import { postWordProgress, getTodaysWords, patchWordProgress } from "../controllers/wordProgressController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireApiKey } from "../middleware/requireApiKey.js";

const router = express.Router();

router.use(requireAuth);  // Middleware for JWT
router.use(requireApiKey);  // Middleware for api key

router.post("/", postWordProgress);
router.get("/", getTodaysWords);
router.patch("/", patchWordProgress);

export default router;