import mongoose from "mongoose";
const {Schema} = mongoose;

const userSchema = new Schema({
    googleId: { type: String, required: true, unique: true},
    username: { type: String, required: true},
    creationDate: { type: Date, required: true}
});

export const User = mongoose.model("User", userSchema);


