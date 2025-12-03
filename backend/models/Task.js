import mongoose from "mongoose";
const {Schema} = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    date: { type: Date, required: true},
    gapAmount: { type: Number, required: true},
    gapType: { type: String, required: true}
});

export const Task = mongoose.model("Task", taskSchema);


