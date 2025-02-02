import { useNavigate } from 'react-router-dom';
import {User, Deck} from './main.tsx';
import { useEffect, useState } from 'react';

function Decks(props: User) {
    const navigate = useNavigate();
    const [decks, setDecks] = useState<Deck[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addingDeck, setAddingDeck] = useState(false);
    const [newDeckName, setNewDeckName] = useState("");
    const [processing, setProcessing] = useState(false);

    async function removeDeck(deck: Deck) {
        try {
            setDecks(decks.filter((d) => d.id !== deck.id));
            fetch("http://localhost:8080/deck", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "deck": deck,
                    "user": props
                })
            });
        } catch (e: any) {
            console.error(e);
        }
    }

    async function addDeck() {
        if (newDeckName == "") {
            setError("Please enter a deck name");
            return;
        }
        setProcessing(true);
        try {
            const res = await fetch("http://localhost:8080/deck", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "deck": {
                        "deckName": newDeckName
                    },
                    "user" : {
                        "id": props!.id,
                        "username": props!.username,
                        "password": props!.password,
                        "email": props!.email
                    }
                })
            });
            if (res.status === 201) {
                const data = await res.json().then((data) => {
                    setDecks([...decks, data]);
                    setAddingDeck(false);
                    setProcessing(false);
                });
            } else {
                setError("Error adding deck");
                setProcessing(false);
            }
        } catch (e: any) {
            setError("Error adding deck");
            setProcessing(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        try {
            fetch ("http://localhost:8080/decks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(props)
            }).then((res) => res.json()).then((data) => {
                setDecks(data);
                setLoading(false);
            })
        } catch (e: any) {
            console.error(e);
            setLoading(false);
        }
    }, []);
    
    return (
        <div style={{marginTop: "80px"}}>
        {loading? <div className="loader"></div>:
        decks.map((deck: Deck) => 
            <div key={deck.id}>
            <div className="deck-card">
                <h3 style={{marginLeft: "10px"}} className="text-button" onClick={() => {
                    navigate("/" + deck.id);
                }}>{deck.deckName}</h3>
                <i style={{marginLeft: "auto"}} className="fa-solid fa-pen-to-square text-button" onClick={() => {
                    navigate("/edit/" + deck.id);
                }}></i>
                <i style={{marginLeft: "20px", marginRight: "10px"}} className="fa-solid fa-trash text-button" onClick={() => {
                    removeDeck(deck);
                }}></i>
            </div>
            <hr className="deck-card-divider"></hr>
            </div>
        )}
         {addingDeck? 
        <div style={{textAlign: "center", padding: "0px 50px"}}>
            {error && <div className="error" style={{marginBottom: "0px", marginTop: "20px"}}>{error}</div>}
            <input type="text" value={newDeckName} onChange={(e)=>setNewDeckName(e.target.value)} placeholder="Deck Name"/>
            <button className={(processing? "disabled" : "")} style={{margin: "10px", display: "inline-block", width: "150px"}} onClick={(e) => addDeck()} disabled={processing}>Save</button>
            <button className={(processing? "disabled" : "")} style={{margin: "10px", display: "inline-block", width: "150px"}} disabled={processing} onClick={(e) => setAddingDeck(false)}>Cancel</button>
        </div>
        : 
        <button style={{margin: "30px auto", display: "block", width: "150px"}} onClick={(e) => {
            setAddingDeck(true)
            setNewDeckName("");
        }}>Add Deck</button>}
        </div>
    )
}

export default Decks;