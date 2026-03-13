import mongoose from "mongoose";
const {Schema} = mongoose;

const wordProgressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    wordId: { type: Schema.Types.ObjectId, ref: "Word", required: true},
    isCompleted: { type: Boolean, default: false },
    level: { type: Number, default: 0 },
    nextReview: { type: Date, required: true }

});

export const WordProgress = mongoose.model("WordProgress", wordProgressSchema);


