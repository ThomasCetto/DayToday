import mongoose from "mongoose";
const {Schema} = mongoose;

const taskSchema = new Schema({
    title: String,
    description: String,
    date: Date,
    every_how_much_amount: Number,
    every_how_much_type: String
});

export const Task = mongoose.model("Task", taskSchema);


