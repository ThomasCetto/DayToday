import { useState } from "react";
import "./AddWordsPage.css";
import SuggestWords from "./SuggestWords";
import ManualAddWords from "./ManualAddWords";

function AddWordsPage() {
    const [mode, setMode] = useState(0);  // Suggested insertion (0) or Manual (1)

    return (
		<div className="toggle-insertion-container">
			<div className="toggle-insertion">
				<button
					className={`toggle-button ${mode === 0 ? "active" : ""}`}
					onClick={() => setMode(0)}
				>
					Suggestions
				</button>

				<button
					className={`toggle-button ${mode === 1 ? "active" : ""}`}
					onClick={() => setMode(1)}
				>
					Manual
				</button>
			</div>

			<div className="add-words__content">
				{ mode === 0 ? <SuggestWords /> : <ManualAddWords /> }
			</div>
		</div>
	);
}

export default AddWordsPage;