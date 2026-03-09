import "./CustomCheckbox.css";

function CustomCheckbox({ checked, onChange, label }) {
    return (
        <label className="checkbox">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="checkbox__box"></span>
            <span className="checkbox__label">{label}</span>
        </label>
    );
}

export default CustomCheckbox;