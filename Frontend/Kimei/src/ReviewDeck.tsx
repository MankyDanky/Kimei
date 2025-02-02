import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./Topbar";
import {User, Deck, UserContext, Card} from "./main"
import { useContext, useEffect, useState } from "react";


function ReviewDeck() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [user, setUser] = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState<Card[]>([]);
    const [deck, setDeck] = useState<Deck | null>(null);
    const [image, setImage] = useState("");
    const [revealed, setRevealed] = useState(false);
    const [reloading, setReloading] = useState(false);

    function urltoImage(url: string): void {
        fetch(url)
         .then(res => res.blob())
         .then(blob => {
             const file = new File([blob], "File name",{ type: "image/png" })
             setImage(URL.createObjectURL(file));
         })
     }
    
    

    useEffect(() => {
        if (reloading) {
            setReloading(false);
            return;
        }
        let tempUser: User| null = null;
        if (localStorage.getItem("user")) {
            setUser(JSON.parse(localStorage.getItem("user")!));
            tempUser = JSON.parse(localStorage.getItem("user")!);
        }
        if (tempUser) {
            fetch("http://localhost:8080/deck/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tempUser)
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setDeck(data);
                        fetch("http://localhost:8080/cards", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                user: tempUser,
                                deck: data
                            })
                        }).then((resCards) => resCards.json()).then((cardsData) => {
                            setCards(cardsData);
                            setLoading(false);
                            if (cardsData.length > 0 && cardsData[0].image) {
                                urltoImage(cardsData[0].image);
                            }
                        });
                    });
                }
            });
        }
    },[reloading])

    return (
        <>
            <Topbar/>
            <div className="centered-container">
            {user? 
                <>
                {loading? 
                    <div className="loader"></div> 
                : 
                cards.length>0? 
                <div style={{display: "block"}}>
                    <div className={"card " + (revealed? "revealed" : "")}>
                        <div className="card-front">
                            <div>
                                <h1 className="card-front-text">{cards[0].cardFront}</h1>
                                {image && <img className={"card-image"} src={image}></img>}
                            </div>
                        </div>
                        <div className="card-back">
                            <h1 className="card-back-text">{cards[0].cardBack}</h1>
                        </div>
                        
                    </div>
                    {!revealed?
                    <button style={{width: "100px", margin: "15px"}} onClick={() => setRevealed(true)}>Reveal</button>
                    :
                    <>
                        <button style={{width: "100px", margin: "15px"}} onClick={() => {
                            setCards(([first, ...rest]) => [...rest, first]);
                            setRevealed(false);
                        }}>Incorrect</button>
                        <button style={{width: "100px", margin: "15px"}} onClick={() => {
                            setCards(cards.slice(1));
                            setRevealed(false);
                        }}>Correct</button>
                    </>
                    }
                </div>
                
                :
                <div>
                    <h1>No more cards to review</h1>
                    <button style={{display: "inlineBlock", margin: "10px", marginLeft: "auto", width: "150px"}} onClick={(e) => navigate("/")}>Home</button>
                    <button style={{display: "inlineBlock", margin: "10px", marginRight: "auto", width: "150px"}} onClick={(e) => {
                        setLoading(true);
                        setReloading(true);
                    }}>Review Again</button>
                </div>
                }
                </>
                
            :
                <div>
                    <h1>Not Logged In</h1>
                    <button style={{display: "block", margin: "auto", width: "100px"}} onClick={(e) => navigate("/")}>Home</button>
                </div>
            }
            </div>
        </>
    )
}

export default ReviewDeck;