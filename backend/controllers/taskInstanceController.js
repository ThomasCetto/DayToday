import { Task } from "../models/Task.js";
import { TaskInstance } from "../models/TaskInstance.js";
import { checkFields } from "../utils/inputUtils.js";


export const getTaskInstance = async (req, res) => {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid TaskInstance ID" });
    }

    try {
        const taskInstance = await TaskInstance.findById(id).populate("task");
        if (!taskInstance) {
            return res.status(404).json({ error: "TaskInstance not found" });
        }
        res.status(200).json(taskInstance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteTaskInstance = async (req, res) => {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid TaskInstance ID" });
    }

    try {
        const taskInstance = await TaskInstance.findByIdAndDelete(id);
        if (!taskInstance) {
            return res.status(404).json({ error: "TaskInstance not found" });
        }
        res.status(200).json({ message: "TaskInstance deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const patchTaskInstance = async (req, res) => {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid TaskInstance ID" });
    }

    const { date, isCompleted } = req.body;
    try {
        const taskInstance = await TaskInstance.findById(id);
        if (!taskInstance) {
            return res.status(404).json({ error: "TaskInstance not found" });
        }

        const parsedDate = date ? new Date(date) : taskInstance.date;
        taskInstance.date = parsedDate;
        if (taskInstance !== undefined) {
            taskInstance.isCompleted = isCompleted;
        }
        await taskInstance.save();

        res.status(200).json({ message: "TaskInstance updated", taskInstance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getTasksFromRange = async (req, res) => {
    const neededParams = ['from', 'to'];
    const params = req.query;
    const paramError = checkFields(params, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }

    // Start and End get passed from the frontend directly in UTC format with complete timestamp
    const startUTC = params['from'];
    const endUTC = params['to'];
    try{
        const entries = await TaskInstance.find({
            date: {
                $gte: startUTC,
                $lt: endUTC
            }
        });
        let output = [];
        for(let i=0; i<entries.length; i++) {
            let entry = entries[i];
            let task = await Task.findById(entry['task']);
            let fullTask = {
                _id: entry['_id'],
                isCompleted: entry['isCompleted'],
                title: task['title'],
                description: task['description']
            };
            output.push(fullTask);
        }
        return res.status(200).json({'tasks': output});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}