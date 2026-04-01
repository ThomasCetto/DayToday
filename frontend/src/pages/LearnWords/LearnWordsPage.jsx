import { useEffect, useState } from "react";
import "./LearnWordsPage.css";
import { apiFetch }  from "../../utils/wrappers.js";
import MeaningsBrowser from "../AddWords/MeaningsBrowser.jsx";
import HiddenCard from "./HiddenCard.jsx";
import { Link } from "react-router";
import PostponeGroup from "./PostponeGroup.jsx";

function LearnWordsPage() {
    const [words, setWords] = useState([]);
    const [definition, setDefinition] = useState(null);
    const [translations, setTranslations] = useState([]);
    const [isRevealed, setIsReavealed] = useState(false);
    const [noWordsAvailable, setNoWordsAvailable] = useState(false);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [loading3, setLoading3] = useState(true);
    
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchWords = async () => {
            try {
                const endpoint = "/api/wordProgresses?goal=50"; // TODO: get goal from user profile
                const response = await apiFetch(endpoint, { method: "GET" });
                const data = await response.json();
                const totalWords = data.newWords.concat(data.toReview);
                if (totalWords.length == 0) {
                    setNoWordsAvailable(true);
                }

                setWords(totalWords);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading1(false);
            }
        }

        if (words.length === 0 && !noWordsAvailable) {
            fetchWords();
        }
    }, [words, noWordsAvailable]);

    useEffect(() => {
        if (words.length === 0) {
            setLoading2(false);
            setLoading3(false);
            return;
        }

        const fetchDefinition = async () => {
            try {
                setLoading2(true);
                const currentWord = words.at(-1).word;
                const dictionary_api = "https://api.dictionaryapi.dev/api/v2/entries/en/";
                const response = await fetch(dictionary_api + currentWord, {method: "GET"});
                
                let data = await response.json();

                // Merge the different meanings in the first array
                let mergedMeanings = [];
                for(let i=0; i<data.length; i++) {
                    mergedMeanings = mergedMeanings.concat(data[i].meanings);
                } 
                data[0].meanings = mergedMeanings;
                
                // Sort meanings by length
                if (data && Array.isArray(data)) {   // if the definition does not exist
                    data[0].meanings.sort((a, b) => {
                        return (b.definitions?.length ?? 0) - (a.definitions?.length ?? 0);
                    });
                }

                setDefinition(data[0]);
            } catch {
                setDefinition(null);
            } finally {
                setLoading2(false);
            }
        }

        const fetchTranslation = async () => {
            try {
                setLoading3(true);
                const currentWord = words.at(-1).word.toLowerCase();
                const translation_api = `https://api.mymemory.translated.net/get?q=${currentWord}&langpair=en|it`;

                const response = await fetch(translation_api, {method: "GET"});
                const data = await response.json();
                const seen = new Set();
                const cleaned = data.matches
                    .map(match => [  // Remove non-letters
                        match.segment.replace(/[^\p{L}\s]/gu, "").trim(),
                        match.translation.replace(/[^\p{L}\s]/gu, "").trim(),
                    ])  
                    .map(match => [  // Capitalize
                        match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase(),
                        match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase(),
                    ])  
                    .filter(match => match[1].length < 22 && 
                        match[1].toLowerCase() !== currentWord &&
                        !seen.has(match[1].toLowerCase()) &&
                        seen.add(match[1].toLowerCase())                        
                    );

                setTranslations(cleaned);
            } catch {
                setTranslations([]);
                console.error("error while fetching the translation");
            } finally {
                setLoading3(false);
            }
        }

        fetchDefinition();
        fetchTranslation();
    }, [words]);

    const postponeWord = async (numberOfDays) => {
        const endpoint = "/api/wordProgresses/";
        await apiFetch(endpoint, {
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
        setIsReavealed(false);
    };

    const deleteMissingWord = async () => {
        const endpoint = "/api/words/" + words.at(-1).wordId;
        await apiFetch(endpoint, {method: "DELETE"});
        setWords(words.slice(0, -1));
        setIsReavealed(false);
    }


    if (error) return <p>Error: {error}</p>;
    if (loading1 || loading2 || loading3) return <p>Loading...</p>;

    if (words.length === 0) {
        return (
            <>
                <h2 className="learn-words-page__completion-title">You have completed all the words for today!</h2><br/><br/><br/>
                <Link to="/addWords" className="learn-words-page__nav-link-button">
                    Go add new ones
                </Link>
            </>
        );
    } else if (definition == null) {
        return (
            <>
                <h1>It looks like the definition of the word "{words.at(-1).word}" was not found</h1>
                <button
                    className="learn-words-page__delete-button"
                    onClick={deleteMissingWord}
                >
                    Remove from collection
                </button>
            </>
        );
    } else if (!isRevealed) {
        return (
            <HiddenCard 
                capitalizedWord={words.at(-1).word}
                onClickReveal={() => setIsReavealed(true)}
                isNewWord={words.at(-1).level <= 0}
            />
        );
    }

    // Words.length > 0 and definition != null and isRevealed == true 

    const audioUrls = definition.phonetics
        .map((p => p.audio))
        .filter(audio => audio); // filters empty entries
    const chosenAudioUrl = (audioUrls.length !== 0) ? audioUrls[0] : "";
    
    return (
        <>  
            <div className="learn-words-page__content">
                <MeaningsBrowser 
                    meanings={definition.meanings}
                    capitalizedWord={definition.word.charAt(0).toUpperCase() + definition.word.slice(1)}
                    phonetic={definition.phonetic}
                    audioUrl={chosenAudioUrl}
                    timesSeen={words.at(-1).level}
                    translations={translations}
                />


                <div className="learn-words-page__review-actions">
                    <PostponeGroup
                        options={[1, 2, 3, 4, 5, 7, 14, 30, -1]}
                        onClick={postponeWord}
                        suggested={words.at(-1).level + 1}
                    />
                </div>
            </div>
            
        </>
    );
}

export default LearnWordsPage;