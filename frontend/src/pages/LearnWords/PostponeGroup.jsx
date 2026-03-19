import "./PostponeGroup.css";

function PostponeGroup({ options, onClick, suggested }) {

    // Choose what button to highlight
    const diff = options.slice(0, -1).map(option => (option - suggested));
    let chosenIndex = 0;
    let currentMin = 1000;
    for (let i=0; i<options.length; i++) {
        if (Math.abs(diff[i]) < currentMin) {
            currentMin = Math.abs(diff[i]);
            chosenIndex = i;
        }
    }


    return (
        <div className="postpone-group">
            <span className="postpone-group__label">Review in:</span>

            {options.map((days, index) => {
                const text = days === -1 ? "Learned" : `${days}d`;

                return (
                    <button
                        key={index}
                        className={"postpone-group__item " + ((index === chosenIndex) ? "suggested" : "")}
                        onClick={() => onClick(days)}
                    >
                        {text}
                    </button>
                );
            })}
        </div>
    );
}

export default PostponeGroup;