import { apiFetch } from "../../utils/wrappers";

function AlreadyKnowButton( { wordId, goNextFunction }) {
    const sendAlreadyKnowAndGoNext = async () => {
        const endpoint = "/api/wordProgresses/";
        try {
            await apiFetch(endpoint, { 
                body: JSON.stringify({
                    "wordId": wordId, 
                    toLearn: false
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
                onClick={sendAlreadyKnowAndGoNext}
            >
                Already know
            </button>
        </>
    )
}

export default AlreadyKnowButton;