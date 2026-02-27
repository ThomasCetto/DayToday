import { Task } from "../models/Task.js";
import { TaskInstance } from "../models/TaskInstance.js";

import { checkFields } from "../utils/inputUtils.js";
import { timeGap } from "../utils/dateUtils.js";
import { config } from "../config/config.js";


export const createTask = async (req, res) => {
    const neededParams = ['title', 'description', 'date', 'gapAmount', 'gapType'];
    const paramError = checkFields(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }

    req.body.gapType = req.body.gapType.toLowerCase();
    const taskData = {
        ...req.body,
        creationDate: new Date(),
        isDeleted: false
    }
    const newTask = new Task({ ...taskData });
    try {
        await newTask.save();
        await createInstances(req, newTask);

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
    
    try {
        // Check if the task exists
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        let today = new Date();
        await TaskInstance.deleteMany({ task: id, date: { $gt: today }});
        await Task.findByIdAndUpdate(id, {isDeleted: true});

        res.status(200).json({ message: "Task and related TaskInstances deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const patchTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, creationDate, date, gapAmount, gapType } = req.body;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid task ID" });
    }
    // Check if params are correct
    const neededParams = ['title', 'description', 'date', 'gapAmount', 'gapType'];
    const paramError = checkFields(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }
    req.body.gapType = req.body.gapType.toLowerCase();
    const taskData = {
        ...req.body,
        creationDate: new Date()
    }


    try {
        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        // Delete old task and its instances
        let today = new Date();
        await TaskInstance.deleteMany({ task: id, date: { $gt: today }});
        await Task.findByIdAndUpdate(id, {isDeleted: true});

        // And create the new patched Task, and new instances
        const newTask = new Task({ ...taskData });
        await newTask.save();
        await createInstances(req, newTask);

        res.status(200).json({ message: "Task edited successfully", task: newTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const createInstances = async (req, newTask) => {
    if (req.body.gapAmount == 0 || req.body.gapType == 'none') {  // Just create 1
        await TaskInstance.insertOne({
            task: newTask._id,
            date: req.body.date,
            isCompleted: false
        });
        return;
    }
    let datesList = timeGap(req.body.date, req.body.gapAmount, req.body.gapType);
    const instances = [];
    let today = new Date();
    for (let i = 0; i < config.TASK_INSTANCE_COUNT; i++) {
        if (datesList[i] >= today) {  // Doesn't add instances before current day
            instances.push({
                task: newTask._id,
                date: datesList[i],
                isCompleted: false
            });
        }
    }
    await TaskInstance.insertMany(instances);
}

