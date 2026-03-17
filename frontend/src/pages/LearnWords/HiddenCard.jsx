import "./HiddenCard.css";

function HiddenCard({ capitalizedWord, onClickReveal, isNewWord }) {

	return (
		<div className="hidden-card">
			<h1 className="hidden-card__title">
                <span className="hidden-card__title-text">{capitalizedWord}</span>
                {isNewWord && (
                    <sup className="hidden-card__new-word-text">(New!)</sup>
                )}
            </h1>
			
            <button className="hidden-card__button" onClick={onClickReveal}>
				Reveal
			</button>
		</div>
	);
}

export default HiddenCard;