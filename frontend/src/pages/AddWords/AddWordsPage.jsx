import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/wrappers";
import "./AddWordsPage.css";

function AddWordsPage() {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // const fetchSuggestions = async () => {
        //     try {
        //         const endpoint = "api/words/suggestions";
        //         const response = await apiFetch(endpoint, { method: "GET" });

        //         if (response.status == 401 || response.status == 403)
        //         throw new Error("You must be logged in to use this page");
        //         if (!response.ok) throw new Error("Couldnt fetch words");
        //         const data = await response.json();
        //         setSuggestions(data.words);
        //     } catch (err) {
        //         setError(err.message);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchSuggestions();
        
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent reload
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());
        if (!payload.words) { return; }
        const noSpaces = payload.words.replace(/\s+/g, "");
        const noFinalComma= noSpaces.replace(/,$/, "");
        const splitted = noFinalComma.split(",");
        payload.words = splitted;

        await apiFetch("/api/words", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    };

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    return (
        <>
            <form method="POST" onSubmit={handleSubmit}>
                <label htmlFor="words-field">
                    Insert the word/words that you want to learn
                    <br />
                    <textarea name="words" id="words-field"></textarea>
                </label>
                <button type="submit"> Add </button>
            </form>

            <label>
                <select 
                    id="word-suggestion"
                    onChange={ (e) => {
                        const wordsField = document.getElementById("words-field");
                        wordsField.value = e.target.value;
                    }}
                >   
                    <option value="">Want some inspiration?</option>
                    
                    {suggestions.map((sugg) => (
                        <option value={sugg}>{sugg}</option>
                    ))} 
                </select>
            </label>
        </>
    );
}

export default AddWordsPage;