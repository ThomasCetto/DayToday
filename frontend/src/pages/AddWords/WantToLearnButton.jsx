import { apiFetch } from "../../utils/wrappers";

function WantToLearnButton( { wordId, goNextFunction }) {
    const sendWantToLearnAndGoNext = async () => {
        const endpoint = "/api/wordProgresses/";
        try {
            await apiFetch(endpoint, { 
                body: JSON.stringify({
                    "wordId": wordId, 
                    toLearn: true
                }), 
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST"
            });
            goNextFunction();
        } catch (error) {
            console.error("error: ", error);
        }
    }

    return (
        <>
            <button
                className="suggestion-confirm-button"
                onClick={sendWantToLearnAndGoNext}
            >
                Want to learn
            </button>
        </>
    )
}

export default WantToLearnButton;