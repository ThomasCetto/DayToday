function PostponeButton({ numberOfDays, onClick }) {
    


    
    return (
        <>
            <button
                onClick={() => onClick(numberOfDays)}
            >
                Postpone {numberOfDays} 
            </button>
        </>
    )
}

export default PostponeButton;
