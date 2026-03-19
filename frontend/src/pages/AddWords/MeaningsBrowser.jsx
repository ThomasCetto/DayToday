import { useState } from "react";
import WordTab from "./WordTab";
import "./MeaningsBrowser.css";

function MeaningsBrowser({ meanings, capitalizedWord, phonetic, audioUrl, timesSeen }) {
    const [meaningIndex, setMeaningIndex] = useState(0);

    if (!meanings || meanings.length === 0) {
        return <p>No meanings found.</p>;
    }

    const meaning = meanings[meaningIndex];

    const nextMeaning = () => {
        setMeaningIndex((prev) => Math.min(prev + 1, meanings.length - 1));
    };

    const prevMeaning = () => {
        setMeaningIndex((prev) => Math.max(prev - 1, 0));
    };

    const prevButton = (
        <button
            onClick={prevMeaning}
            disabled={meaningIndex === 0}
            className="meaning-button"
        >
            ←
        </button>
    );

    const nextButton = (
        <button
            onClick={nextMeaning}
            disabled={meaningIndex === meanings.length - 1}
            className="meaning-button"
        >
            →
        </button>
    );

    return (
        <WordTab
            word={capitalizedWord}
            partOfSpeech={meaning.partOfSpeech}
            synonyms={meaning.synonyms}
            definitions={meaning.definitions}
            phonetic={phonetic}
            audioUrl={audioUrl}
            prevButton={prevButton}
            nextButton={nextButton}
			meaningIndex={meaningIndex}
			totalMeanings={meanings.length}
            timesSeen={timesSeen}
        />
    );
}

export default MeaningsBrowser;