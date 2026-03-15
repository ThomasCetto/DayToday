import { useEffect, useState } from "react";
import "./LearnWordsPage.css";
import { apiFetch }  from "../../utils/wrappers.js";
import PostponeButton from "./PostponeButton.jsx";

function LearnWordsPage() {
    const [words, setWords] = useState([]);


    useEffect(() => {
        const fetchWords = async () => {
            const endpoint = "/api/wordProgresses?goal=3"; // TODO: get goal from user profile
            const response = await apiFetch(endpoint, { method: "GET" });
            const data = await response.json();

            console.log("toReview: ", data.toReview)

            setWords(data.newWords.concat(data.toReview));
        }

        fetchWords();
    }, []);

    const postponeWord = async (numberOfDays) => {
        console.log("Postponign in the funciton of " + numberOfDays);
        const endpoint = "/api/wordProgresses/";
        const response = await apiFetch(endpoint, {
            method: "PATCH",
            body: JSON.stringify({
                offset: numberOfDays,
                wordId: words.at(-1).wordId
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        setWords(words.slice(0, -1));

        console.log("Postpone response: ", response);
    };

    console.log("Words: ", words)

    return (
        <>
            <h1>Learn words</h1>
            { words.length === 0 && (
                <h2>There are no more words to learn today</h2>
            )}

            { words.length > 0 && (
                <>
                    <h3>{words.at(-1).word}</h3>
                    <PostponeButton numberOfDays={1} onClick={postponeWord} />
                    <PostponeButton numberOfDays={3} onClick={postponeWord} />
                    <PostponeButton numberOfDays={5} onClick={postponeWord} />
                </>
            )}
            
            
            
        </>
    );
}

export default LearnWordsPage;