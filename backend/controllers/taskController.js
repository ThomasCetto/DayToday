import { Task } from "../models/Task.js";
import { TaskInstance } from "../models/TaskInstance.js";

import { checkFields } from "../utils/inputUtils.js";
import { timeGap } from "../utils/dateUtils.js";
import { config } from "../config/config.js";


export const createTask = async (req, res) => {
    const neededParams = ['title', 'date', 'gapType'];
    const paramError = checkFields(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }
    if (!req.body.gapAmount) req.body.gapAmount = 1;
    if (!req.body.description) req.body.description = ' ';

    console.log("######: ", req)

    req.body.gapType = req.body.gapType.toLowerCase();
    let dateMidday = new Date(req.body.date);
    dateMidday.setHours(12);  // To avoid problems with daylight savings
    req.body.date = dateMidday;
    const userId = req.user.userId;
    const taskData = {
        ...req.body,
        creationDate: new Date(),
        isDeleted: false,
        userId: userId
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
        if (task.userId != req.user.userId) {
            return res.status(403).json({ error: "You don't have the authorization to delete this task"})
        }

        let today = new Date();
        today.setHours(0,0,0,0);
        await TaskInstance.deleteMany({ task: id });
        await Task.findByIdAndUpdate(id, {isDeleted: true});

        res.status(200).json({ message: "Task and related TaskInstances deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const putTask = async (req, res) => {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid task ID" });
    }
    // Check if params are correct
    const neededParams = ['title', 'description', 'date', 'gapType'];
    const paramError = checkFields(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }
    req.body.gapAmount ??= 1;
    req.body.gapType = req.body.gapType.toLowerCase();

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            req.body,
            { returnDocument: "after" }  // returns the new document
        );
        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        // Delete future instances of the old task
        let startOfToday = new Date();
        startOfToday.setHours(0,0,0,0);
        await TaskInstance.deleteMany({ task: id, date: { $gte: startOfToday }});
        await createInstances(req, updatedTask);
        res.status(200).json({ message: "Task edited successfully", task: updatedTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const createInstances = async (req, newTask) => {
    // Just a helper function, no need to check parameters
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
    for (let i = 0; i < config.TASK_INSTANCE_COUNT; i++) {
        instances.push({
            task: newTask._id,
            date: datesList[i],
            isCompleted: false
        });
    }
    await TaskInstance.insertMany(instances);
}

//  Returns all non-deleted Tasks
export const getOngoingTasks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const tasks = await Task.find({ userId, isDeleted: false });
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const stats = await Promise.all(
            tasks.map(async (task) => {
                const total = await TaskInstance.countDocuments({ task: task._id, date: {$lte: endOfToday}});
                const completed = await TaskInstance.countDocuments({
                    task: task._id,
                    isCompleted: true
                });
                return {
                    task,
                    total,
                    completed
                };
            })
        );
        res.status(200).json({'tasks': stats});
    } catch(err) {
        console.log(err)
        res.status(500).json({error: "Server error"});
    }
}
