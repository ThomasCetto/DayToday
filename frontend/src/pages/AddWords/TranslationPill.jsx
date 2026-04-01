import { useState } from "react";

function TranslationPill( { segment, translation }) {
    const [showTranslation, setShowTranslation] = useState(true);

    return (
        <>
            <span
                className="word-tab__translation-pill"
                onClick={() => setShowTranslation(!showTranslation)}
            >
                {showTranslation ? translation : segment}
            </span>
        </>
    )
}

export default TranslationPill;