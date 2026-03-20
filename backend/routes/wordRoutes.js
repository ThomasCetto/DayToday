import express from "express";
import { addWords, getSuggestions, deleteWord } from "../controllers/wordController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireApiKey } from "../middleware/requireApiKey.js";

const router = express.Router();

router.use(requireAuth);  // Middleware for JWT
router.use(requireApiKey);  // Middleware for api key

router.post("/", addWords);
router.get("/suggestions", getSuggestions);
router.delete("/:wordId", deleteWord);

export default router;