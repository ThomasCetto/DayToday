import "./CustomCheckbox.css";

function CustomCheckbox({ checked, onChange, label }) {
    return (
        <label className={`checkbox ${checked ? "checked" : ""}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />

            <span className="checkbox__box">
                <svg viewBox="0 0 50 50">
                    <path d="M5 30 L20 45 L45 5" />
                </svg>
            </span>

            <span className="checkbox__label">{label}</span>
        </label>
    );
}

export default CustomCheckbox;