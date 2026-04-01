import { useRef } from "react";
import "./WordTab.css";
import  DefinitionRow from "./DefinitionRow";
import TranslationPill from "./TranslationPill";

function WordTab({
    word,
    partOfSpeech,
    synonyms = [],
    definitions = [],
    phonetic,
    audioUrl,
    prevButton,
    nextButton,
	meaningIndex,
	totalMeanings,
    timesSeen,
    translations
}) {
    const audioRef = useRef(null);

    const playAudio = async (url) => {
        if (!url || !audioRef.current) return;

        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
        audio.src = url;
        audio.load();
        await audio.play();
    };

    // Sort definitions so that those with examples come up first
    definitions.sort((def1, def2) => {
        return (def1.example == null) - (def2.example == null);
    });

    return (
        <div className="word-tab">
            <div className="word-tab__header">
                <div>
                    <h1 className="word-tab__title">
                        {word}
                        { (timesSeen > 0) && 
                            <sup className="word-tab__repetition">
                                {timesSeen} times
                            </sup>
                        }
                    </h1>
                    {phonetic && <p className="word-tab__phonetic">{phonetic}</p>}
                    {translations?.length > 0 && (
                        <section className="word-tab__translations-section">
                            <br/>
                            <div className="word-tab__translations">
                                {[...new Set(translations)].map((tr, index) => (
                                    <TranslationPill 
                                        key={index}
                                        segment={tr[0]}
                                        translation={tr[1]}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {audioUrl && (
                    <>
                        <button
                            type="button"
                            className="word-tab__play-button"
                            onClick={() => playAudio(audioUrl)}
                            aria-label={`Play pronunciation for ${word}`}
                            title="Play pronunciation"
                        >
                            <span className="word-tab__play-icon">▶</span>
                        </button>
                        <audio ref={audioRef} preload="none" />
                    </>
                )}
            </div>

            <div className="word-tab__meta-row">
                {prevButton}
                {partOfSpeech && (
					<div className="word-tab__badge">
						{partOfSpeech}
					</div>
                )}
                {nextButton}

				<div className="word-tab__meanings-counter">
					{meaningIndex + 1}/{totalMeanings} 
				</div>
			</div>


            {definitions.length > 0 && (
                <section className="word-tab__section">
                    <h2 className="word-tab__section-title">Definitions</h2>
                    <ol className="word-tab__definitions">
                        {definitions.map((definition, index) => (
                            <DefinitionRow 
                                key={index}
                                definition={definition.definition}
                                example={definition.example}
                            />
                        ))}
                    </ol>
                </section>
            )}

            {synonyms.length > 0 && (
                <section className="word-tab__section">
                    <h2 className="word-tab__section-title">Synonyms</h2>
                    <div className="word-tab__synonyms">
                        {synonyms.map((synonym, index) => (
                            <span key={index} className="word-tab__synonym-pill">
                                {synonym}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default WordTab;