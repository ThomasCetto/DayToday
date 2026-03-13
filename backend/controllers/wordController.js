import { Word } from "../models/Word.js";
import { WordProgress } from "../models/WordProgress.js";

import { checkFields } from "../utils/inputUtils.js";


export const addWords = async (req, res) => {
    const neededParams = ['words'];
    const paramError = checkFields(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }

    const userId = req.user.userId;
    const today = new Date();
    today.setHours(12); // To avoid daylight savings problems

    req.body.words.forEach(async word => {
        try {
            if(word) { 
                const capitalized = word[0].toUpperCase() + word.slice(1);
                const newWord = new Word({word: capitalized, verified: false});
                const newWordProgress = new WordProgress({
                    userId: userId,
                    wordId: newWord._id,
                    isCompleted: false,
                    level: 0,
                    nextReview: today
                });
                await newWord.save();
                await newWordProgress.save();
            }
        } catch (err) {
            console.error("Error while saving dictionary words from user: [" + word + "], ", err);
        }
    });
    res.status(200).json({ message: "Words added successfully" });
    //res.status(500).json({ message: "An error occurred while saving the words" });
}

// export const getTask = async (req, res) => {
//     const { id } = req.params;
//     if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
//         return res.status(400).json({ error: "Invalid task ID" });
//     }

//     try {
//         const task = await Task.findById(id);

//         if (!task) {
//             return res.status(404).json({ error: "Task not found" });
//         }

//         res.status(200).json(task);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server error" });
//     }
// };
