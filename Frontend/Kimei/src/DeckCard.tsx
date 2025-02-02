import { Deck } from "./main";

function DeckCard(props: Deck) {
    return (
        <>
        <div className="deck-card">
            <h3 className="text-button">{props.deckName}</h3>
            <i style={{marginLeft: "auto"}} className="fa-solid fa-pen-to-square text-button"></i>
            <i style={{marginLeft: "20px"}} className="fa-solid fa-trash text-button"></i>
        </div>
        <hr className="deck-card-divider"></hr>
        </>
    );
}

export default DeckCard;