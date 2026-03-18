function PostponeGroup({ options, onClick }) {
    return (
        <div className="postpone-group">
            <span className="postpone-group__label">Review in:</span>

            {options.map((days) => {
                const text = days === -1 ? "Learned" : `${days}d`;

                return (
                    <button
                        key={days}
                        className="postpone-group__item"
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