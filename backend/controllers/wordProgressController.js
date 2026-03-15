import { Word } from "../models/Word.js";
import { WordProgress } from "../models/WordProgress.js";

import { checkFields } from "../utils/inputUtils.js";

// Used after pressing buttons "already know" "to-learn"
export const postWordProgress = async (req, res) => {
    const neededParams = ['wordId', 'toLearn'];
    const paramError = checkFields(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }

    let today = new Date();
    today.setHours(12);  // To prevent daylight saving errors

    const userId = req.user.userId;
    try {
        const newProgress = new WordProgress({
            userId: userId,
            wordId: req.body.wordId,
            level: req.body.toLearn ? 0 : 5,  // either first time seeing it or already learned
            nextReview: today
        });
        await newProgress.save();
        res.status(200).json({message: "Progress saved successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error while saving the word progress"});
    }
};