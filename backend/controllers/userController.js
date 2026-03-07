import { User } from "../models/User.js";
import { checkFields } from "../utils/inputUtils.js";


export const createUser = async (req, res) => {
    const neededParams = ['username', 'password'];
    const paramError = checkFields(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }
    const userData = {
        ...req.body,
        creationDate: new Date()
    }
    const newUser = new User({ ...userData });
    try {
        await newUser.save();
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}