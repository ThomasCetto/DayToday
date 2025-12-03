import { Task } from "../models/Task.js";
import { TaskInstance } from "../models/TaskInstance.js";

import { checkField } from "../utils/inputUtils.js";
import { timeGap } from "../utils/dateUtils.js";

const createTaskInstances = async (req, res)  => {
    let datesList = timeGap(req.body.date, req.body.gapAmount, req.body.gapType);
    for (let i = 0; i < 30; i++) {
        const newInstance = new TaskInstance({
            task: newTask._id,
            date: Date.parse(datesList[i]),
            is_completed: false
        });
        await newInstance.save();
    }
}

export const createTask = async (req, res) => {
    const neededParams = ['title', 'description', 'date', 'gapAmount', 'gapType'];
    const paramError = checkField(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }

    req.body.gapType = req.body.gapType.toLowerCase();
    const newTask = new Task({ ...req.body });
    try {
        // Crete the task
        await newTask.save();

        // Create 30 task instances
        let datesList = timeGap(req.body.date, req.body.gapAmount, req.body.gapType);
        for (let i = 0; i < 30; i++) {
            console.log("saving");
            console.log(datesList[i]);

            const newInstance = new TaskInstance({
                task: newTask._id,
                date: Date.parse(datesList[i]),
                is_completed: false
            });
            await newInstance.save();
        }

        res.status(200).json({ message: "task created" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}

export const getTask = async (req, res) => {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid task ID" });
    }

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid task ID" });
    }
    console.log("deleteing ", id);
    
    try {
        // Check if the task exists
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        await TaskInstance.deleteMany({ task: id });
        await Task.findByIdAndDelete(id);

        res.status(200).json({ message: "Task and related TaskInstances deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const patchTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, date, gapAmount, gapType } = req.body;

    // Task to delete id check
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid task ID" });
    }
    // New Task data check
    const neededParams = ['title', 'description', 'date', 'gapAmount', 'gapType'];
    const paramError = checkField(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }
    req.body.gapType = req.body.gapType.toLowerCase();


    try {
        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        // Delete old
        await TaskInstance.deleteMany({ task: id });
        await Task.findByIdAndDelete(id);

        // And create the new patched Task
        const newTask = new Task({ ...req.body });
        await newTask.save();

        // Create 30 task instances
        let datesList = timeGap(req.body.date, req.body.gapAmount, req.body.gapType);
        for (let i = 0; i < 30; i++) {
            console.log("saving");
            const newInstance = new TaskInstance({
                task: newTask._id,
                date: Date.parse(datesList[i]),
                is_completed: false
            });
            await newInstance.save();
        }

        res.status(200).json({ message: "Task edited successfully", task: newTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

