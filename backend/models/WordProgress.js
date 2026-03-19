import mongoose from "mongoose";
const {Schema} = mongoose;

const wordProgressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    wordId: { type: Schema.Types.ObjectId, ref: "Word", required: true},
    level: { type: Number, default: -1 },  // -1 (Never seen), 0 (Started to learn) to 100 (Learned)
    nextReview: { type: Date, required: true }

});

export const WordProgress = mongoose.model("WordProgress", wordProgressSchema);


