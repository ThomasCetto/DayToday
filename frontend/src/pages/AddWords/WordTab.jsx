import { useRef, useState, useEffect } from "react";
import "./WordTab.css";

function WordTab({
    word,
    partOfSpeech,
    synonyms = [],
    definitions = [],
    phonetic,
    audioUrl,
    fallbackAudioUrl,
    prevButton,
    nextButton,
	meaningIndex,
	totalMeanings
}) {
    const audioRef = useRef(null);
    const [audioAvailable, setAudioAvailable] = useState(false);

    useEffect(() => {
        const checkAudio = async () => {
            try {
                const res = await fetch(audioUrl, { method: "HEAD" });
                if (res.ok) {
                    setAudioAvailable(true);
                    return;
                }
            } catch (err) {
                console.error(err);
            }

            if (fallbackAudioUrl) {
                try {
                    const res = await fetch(fallbackAudioUrl, { method: "HEAD" });
                    if (res.ok) {
                        setAudioAvailable(true);
                        return;
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            setAudioAvailable(false);
        };

        checkAudio();
    }, [audioUrl, fallbackAudioUrl]);

    const playAudio = async (url) => {
        if (!url || !audioRef.current) return false;

        try {
            const audio = audioRef.current;
            audio.pause();
            audio.currentTime = 0;
            audio.src = url;
            audio.load();
            await audio.play();
            return true;
        } catch {
            return false;
        }
    };

    const handlePlayAudio = async () => {
        const playedPrimary = await playAudio(audioUrl);

        if (!playedPrimary && fallbackAudioUrl) {
            await playAudio(fallbackAudioUrl);
        }
    };

    return (
        <div className="word-tab">
            <div className="word-tab__header">
                <div>
                    <h1 className="word-tab__title">{word}</h1>
                    {phonetic && <p className="word-tab__phonetic">{phonetic}</p>}
                </div>

                {audioAvailable && (
                    <>
                        <button
                            type="button"
                            className="word-tab__play-button"
                            onClick={handlePlayAudio}
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
                            <li key={index} className="word-tab__definition-item">
                                {typeof definition === "string"
                                    ? definition
                                    : definition.definition}
                            </li>
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