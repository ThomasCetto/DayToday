import mongoose from "mongoose";
const {Schema} = mongoose;
import { Task } from "./Task.js";

const taskInstanceSchema = new Schema({
    task: { type: Schema.Types.ObjectId, ref: "Task" },
    date: Date,
    is_completed: Boolean
});

export const TaskInstance = mongoose.model("TaskInstance", taskInstanceSchema);