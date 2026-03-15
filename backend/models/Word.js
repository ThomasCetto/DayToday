import mongoose from "mongoose";
const {Schema} = mongoose;

const wordSchema = new Schema({
    word: { type: String, required: true },
    verified: { type: Boolean, default: false }
});

export const Word = mongoose.model("Word", wordSchema);


