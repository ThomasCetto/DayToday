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
            level: req.body.toLearn ? 0 : 100,  // either first time seeing it or already learned
            nextReview: today
        });
        await newProgress.save();
        console.log("Log: successful new word progress creation");
        res.status(200).json({message: "Progress saved successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error while saving the word progress"});
    }
};

// Returns all the words that the user is learning that have the date today / in the past and 
// have 0 < level < 5, plus "goal" (default. 3, passed by frontend) of level 0 
export const getTodaysWords = async (req, res) => {
    const neededParams = ['goal'];
    const paramError = checkFields(req.query, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        return res.status(400).json({ error: paramError });
    }

    let endOfToday = new Date();
    endOfToday.setHours(23,59,59,999);

    const userId = req.user.userId;
    const goal = Number(req.query.goal);
    try {
        const toReview = await WordProgress.find({
            userId: userId,
            nextReview: { $lt: endOfToday },
            level: { $gt: 0, $lt: 100}
        })
        .populate('wordId', 'word')
        .sort({ _id: 1}); // sort from oldest to newest 

        const newWords = await WordProgress.find({
            userId: userId, 
            level: 0
        })
        .limit(req.query.goal)
        .populate('wordId', 'word')
        .sort({ _id: 1}); // sort from oldest to newest

        const toReviewStrings = toReview.map(wp => ({
            word: wp.wordId.word,
            wordId: wp.wordId._id,
            level: wp.level
        }));
        const newWordsStrings = newWords.map(wp => ({
            word: wp.wordId.word,
            wordId: wp.wordId._id,
            level: wp.level
        }));

        console.log("Log: successful get today's words");
        res.status(200).json({ toReview: toReviewStrings, newWords: newWordsStrings });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "an error occured"});
    }
}

export const patchWordProgress = async (req, res) => {
    const neededParams = [];
    const paramError = checkFields(req.body, neededParams);
    if (paramError.length !== 0) {  // if some param is missing
        console.error(paramError)
        return res.status(400).json({ error: paramError });
    }

    const offset = req.body.offset;
    const newReview = new Date();
    newReview.setDate(newReview.getDate() + req.body.offset);
    
    const userId = req.user.userId;
    try {
        await WordProgress.findOneAndUpdate(
            {
                userId: userId,
                wordId: req.body.wordId
            },
            [
                {
                    $set: {
                        nextReview: newReview,
                        level: {
                            $cond: {
                                if: { $eq: [offset, -1] },
                                then: 100,
                                else: { $add: ["$level", 1] }
                            }
                        }
                    }
                }
            ],
            {
                updatePipeline: true
            }
        );
        console.log("Log: successful patch word progress");
        res.status(200).json({message: "Updated review"});
    } catch(error) {
        console.error(error);
        res.status(500).json({error: "Error in the server"});
    }
}