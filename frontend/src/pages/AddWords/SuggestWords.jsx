import { useEffect, useState } from "react";
import "./SuggestWords.css";
import { apiFetch } from "../../utils/wrappers";
import MeaningsBrowser from "./MeaningsBrowser";
import AlreadyKnowButton from "./AlreadyKnowButton";
import WantToLearnButton from "./WantToLearnButton";


function SuggestWords() {
    const [suggestions, setSuggestions] = useState([]);
    const [wordData, setWordData] = useState(null);
    const [translations, setTranslations] = useState([]);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [loading3, setLoading3] = useState(true);
    
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const endpoint = "api/words/suggestions";
                const response = await apiFetch(endpoint, { method: "GET" });

                if (response.status == 401 || response.status == 403)
                    throw new Error("You must be logged in to use this page");
                if (!response.ok) throw new Error("Couldnt fetch words");
                const data = await response.json();
                data.words.reverse();
                if (data.words.length !== 0) {
                    setSuggestions(data.words);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading1(false);
            }
        };

        if (suggestions.length === 0) {
            fetchSuggestions();
        }
    }, [suggestions]);

    useEffect(() => {
        if (suggestions.length === 0 ) {
            setWordData(null);
            setLoading2(false);
            setLoading3(false);
            return;
        }

        const fetchDefinition = async () => {
            try {
                setLoading2(true);
                setWordData(null);

                const currentWord = suggestions.at(-1).word;
                const dictionary_api = "https://api.dictionaryapi.dev/api/v2/entries/en/";
                const response = await fetch(dictionary_api + currentWord, {method: "GET"});
                const data = await response.json();
                
                // Merge meanings into one array if they are separated
                let mergedMeanings = [];
                for(let i=0; i<data.length; i++) {
                    mergedMeanings = mergedMeanings.concat(data[i].meanings);
                } 
                data[0].meanings = mergedMeanings;

                setWordData(data[0]);
            } catch (err) {
                setError("Error while fetching suggestions: ", err.message);
            } finally {
                setLoading2(false);
            }
        }

        const fetchTranslation = async () => {
            try {
                setLoading3(true);
                const currentWord = suggestions.at(-1).word.toLowerCase();
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
    }, [suggestions]);

    const deleteMissingWord = async () => {
        const endpoint = "/api/words/" + suggestions.at(-1).wordId;
        await apiFetch(endpoint, {method: "DELETE"});
        setSuggestions(suggestions.slice(0, -1));
    }

    if (loading1 || loading2 || loading3) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    let chosenAudioUrl = "";
    if (wordData != null) {
        const audioUrls = wordData.phonetics
            .map((p => p.audio))
            .filter(audio => audio); // filters empty entries
        chosenAudioUrl = (audioUrls.length !== 0) ? audioUrls[0] : "";
    }

    return (
        <>
            <div className="suggestion-content">
                { suggestions.length === 0 && (
                    <h1>There are no suggestions left, try later</h1>
                )}

                { suggestions.length > 0 && ( 
                    <>
                        { wordData == null && (
                            <>
                                <h1>It looks like the word "{suggestions.at(-1).word}" was not found</h1>
                                <button
                                    className="suggest-words__delete-button"
                                    onClick={deleteMissingWord}
                                >
                                    Remove from collection
                                </button>
                            </>
                        )}

                        { wordData != null && (
                            <>
                                <MeaningsBrowser 
                                    meanings={wordData.meanings}
                                    capitalizedWord={wordData.word.charAt(0).toUpperCase() + wordData.word.slice(1)}
                                    phonetic={wordData.phonetic}
                                    audioUrl={chosenAudioUrl}
                                    timesSeen={0}
                                    translations={translations}
                                />

                                <div className="suggestion-empty-div"></div>

                                {/* Buttons to set the word as known or to-learn */}
                                <div className="suggestion-actions">
                                    <AlreadyKnowButton 
                                        wordId={suggestions.at(-1).wordId}
                                        goNextFunction={() => {
                                            setSuggestions((prev) => prev.slice(0, -1));  // go next word
                                        }}
                                    />

                                    <WantToLearnButton 
                                        wordId={suggestions.at(-1).wordId}
                                        goNextFunction={() => {
                                            setSuggestions((prev) => prev.slice(0, -1));  // go next word
                                        }}
                                    />
                                </div>
                                
                            </>
                        )}
                    </>
                )} 
            </div>
        </>
    );
}

export default SuggestWords;