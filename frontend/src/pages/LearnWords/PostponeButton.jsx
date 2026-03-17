function PostponeButton({ numberOfDays, onClick }) {
    const buttonText = (numberOfDays == -1) ? "Learned" : numberOfDays + " days";
    return (
        <>
            <button 
                className="postpone-button__button"
                onClick={() => onClick(numberOfDays)}
            >
                {buttonText}
            </button>
        </>
    )
}

export default PostponeButton;
