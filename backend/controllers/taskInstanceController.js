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
    const neededParams = ['isCompleted', 'date'];
    const paramError = checkFields(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }

    const { id } = req.params;
    const { date, isCompleted } = req.body;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid TaskInstance ID" });
    }

    try {
        const taskInstance = await TaskInstance.findById(id);
        if (!taskInstance) {
            return res.status(404).json({ error: "TaskInstance not found" });
        }

        const parsedDate = new Date(date);
        taskInstance.date = parsedDate;
        taskInstance.isCompleted = isCompleted;

        await taskInstance.save();

        res.status(200).json({ message: "TaskInstance updated", taskInstance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};