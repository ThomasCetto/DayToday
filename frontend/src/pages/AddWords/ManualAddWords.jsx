import { apiFetch } from "../../utils/wrappers";
import "./ManualAddWords.css";

function ManualAddWords() {
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent reload
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());
        if (!payload.words) { return; }
        
        try {
            // Clean input
            const noSpaces = payload.words.trim();
            const noFinalComma = noSpaces.replace(/,$/, "");
            const splitted = noFinalComma
                .split(",")
                .map(cell => cell.trim().replace(/\s+/g, " "))  // Multiple whitespaces turn into one
                .filter(cell => cell !== "");
            payload.words = splitted;

            await apiFetch("/api/words", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        } catch(err) {
            console.error(err);
        } finally {
            e.target.reset(); // clear fields 
        }
    };



    return (
        <>
            <h1>Manual</h1>
            <form method="POST" onSubmit={handleSubmit}>

                <textarea
                    name="words"
                    id="words-field"
                    placeholder="genuflect, ripple, holster, ..."
                />
                <br />
                <div className="tooltip-manual"> i
                    <span className="tooltip-manual-text">You can add multiple words at the same time by separating them with a comma</span>
                </div>
                    

                <br />
                <button type="submit" className="manual-submit-button">
                    Add
                </button>
            </form>
        </>
    );
}

export default ManualAddWords;