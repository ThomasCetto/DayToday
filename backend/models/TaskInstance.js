import mongoose from "mongoose";
const {Schema} = mongoose;

const taskInstanceSchema = new Schema({
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true},
    date: { type: Date, required: true},
    isCompleted: { type: Boolean, required: true}
});

export const TaskInstance = mongoose.model("TaskInstance", taskInstanceSchema);