import mongoose from "mongoose";
const {Schema} = mongoose;

const wordSchema = new Schema({
    word: { type: String, required: true },
    verified: { type: String, default: false }
});

export const Word = mongoose.model("Word", wordSchema);


