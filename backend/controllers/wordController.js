import { Word } from "../models/Word.js";
import { WordProgress } from "../models/WordProgress.js";

import { checkFields } from "../utils/inputUtils.js";
import { config } from "../config/config.js";


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
                let wordDB = await Word.findOne({word: capitalized});
                if (!wordDB) {
                    wordDB = new Word({word: capitalized, verified: true});   // TODO: CHANGE TO FALSE
                    await wordDB.save();
                }

                const newWordProgress = new WordProgress({
                    userId: userId,
                    wordId: wordDB._id,
                    level: 0,
                    nextReview: today
                });
                await newWordProgress.save();
            }
        } catch (err) {
            console.error("Error while saving dictionary words from user: [" + word + "], ", err);
        }
    });
    res.status(200).json({ message: "Words added successfully" });
}


export const getSuggestions = async (req, res) => {
    const userId = req.user.userId;
    try {
        // Get X words that the user has not completed yet
        const notLearned = await Word.aggregate([
            {
                $match: {
                    _id: {
                        $nin: await WordProgress.distinct("wordId", {
                            userId: userId
                        })
                    },
                    verified: true
                }
            },
            {
                $project: {
                    _id: 0,
                    wordId: "$_id",
                    word: 1
                }
            },
            {
                $limit: config.NUMBER_OF_SUGGESTED_WORDS
            }
        ]);

        res.status(200).json({words: notLearned});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Error while choosing word suggestions"});
    }

};