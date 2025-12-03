import express from "express";
import { patchTaskInstance, getTaskInstance, deleteTaskInstance } from "../controllers/taskInstanceController.js";


const router = express.Router();

router.get("/:id", getTaskInstance);
router.delete("/:id", deleteTaskInstance);
router.patch("/:id", patchTaskInstance);

export default router;