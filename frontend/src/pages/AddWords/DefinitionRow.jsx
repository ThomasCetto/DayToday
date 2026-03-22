import { useState } from "react";
import "./DefinitionRow.css";

function DefinitionRow( { definition, example }) {
    const [showExample, setShowExample] = useState(false);

    return (
		<li className="word-tab__definition-item">
            <div className="definition-row-inner">
                <span className="word-tab__tooltip-wrapper">
                    <button
                        type="button"
                        className={"word-tab__definition-tooltip-button " + (example ? "" : "no-example")}
                        onClick={() => setShowExample((prev) => !prev)}
                    >
                        Ex
                    </button>

                    {showExample && example && (
                        <span className="word-tab__tooltip-text">
                            {example}
                        </span>
                    )}
                </span>

                <span className="word-tab__definition-text">
                    {definition}
                </span>
            </div>
		</li>
	);
}

export default DefinitionRow;