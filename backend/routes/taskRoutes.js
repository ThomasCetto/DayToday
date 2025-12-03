import express from "express";
import { createTask, getTask, deleteTask, patchTask } from "../controllers/taskController.js";


const router = express.Router();

router.post("/", createTask);
router.get("/", getTask);
router.delete("/:id", deleteTask);
router.patch("/:id", patchTask);

export default router;