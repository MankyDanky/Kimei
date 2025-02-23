import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./Topbar";
import { Deck, User, UserContext, Card} from "./main";
import { useContext, useEffect, useState } from "react";


function DeckEditor() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [user, setUser] = useContext(UserContext);
    const [cards, setCards] = useState<Card[]>([]);
    const [deck, setDeck] = useState<Deck | null>(null);
    const [loading, setLoading] = useState(true);
    const [displayedCard, setDisplayedCard] = useState<Card | null>(null);
    const [newFront, setNewFront] = useState("");
    const [newBack, setNewBack] = useState("");
    const [newImage, setNewImage] = useState<File | null>()
    const [imagePreview, setImagePreview] = useState("");
    const [activeTab, setActiveTab] = useState<number>(0);
    const [error, setError] = useState("");
    const [addingCard, setAddingCard] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [processing, setProcessing] = useState(false);

    async function generateBack() {
        if (newFront == "") {
            setError("Enter front of card to generate back");
            setProcessing(false)
        } else {
            try {
                fetch("http://localhost:8080/ai?prompt=" + "Succinctly describe/answer/define the following in a single paragraph using 100 characters or less: " + newFront).then((res) => res.text()).then((data) => {
                    setNewBack(data);
                    setProcessing(false);
                });
                
            } catch (e: any) {
                console.error(e);
                setProcessing(false);
            }
        }
    }

    async function deleteCard(card: Card) {
        try {
            setCards(cards.filter((c) => c.id !== card.id));
            fetch("http://localhost:8080/card", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "deck": deck,
                    "user": user,
                    "card": card
                })
            });
        } catch (e: any) {
            console.error(e);
        }
    }

    async function editTitle() {
        if (newTitle == "") {
            setError("Title can't be empty")
        } else {
            try {
                const newDeck: Deck = {deckName: newTitle, id: deck!.id};
                fetch("http://localhost:8080/deck", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "deck": newDeck,
                        "user": user
                    })
                }).then(() => {
                    setEditingTitle(false);
                    setDeck({deckName: newTitle, id: deck!.id});
                    setNewTitle("");
                    setError("");
                })
            } catch (e: any) {
                console.error(e);
            }
        }
    }

    async function editCard(card: Card) {
        setDisplayedCard(card);
        setError("");
        setNewFront(card.cardFront);
        setNewBack(card.cardBack);
        setActiveTab(0);
        if (card.image) {
            urltoImage(card.image)
        } else {
            setNewImage(null);
            setImagePreview("");
        }
    }

    async function urltoImage(url: string): Promise<void> {
       fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], "File name",{ type: "image/png" })
            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
        })
    }

    function addCard(encodedImage: string):void {
        const newCard: Card = {image: encodedImage, id: displayedCard!.id, cardBack: newBack, cardFront: newFront}
        try {
            fetch("http://localhost:8080/card", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "deck": deck,
                    "user": user,
                    "card": newCard
                })
            }).then((res) => res.json()).then((data) => {
                const newCards: Card[] = [...cards, data];
                setCards(newCards);
                setDisplayedCard(null);
                setProcessing(false);
                setAddingCard(false);
            });
        } catch (e: any) {
            setDisplayedCard(null);
            setAddingCard(false);
            setProcessing(false);
            console.error(e);
        }
    }

    function updateCard(encodedImage: string):void {
        const newCard: Card = {image: encodedImage, id: displayedCard!.id, cardBack: newBack, cardFront: newFront}
        try {
            fetch("http://localhost:8080/card", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "deck": deck,
                    "user": user,
                    "card": newCard
                })
            }).then((res) => {
                const newCards: Card[] = cards.map((card: Card) => {
                    if (card.id === newCard.id) {
                        return newCard;
                    } else {
                        return card;
                    }
                })
                setDisplayedCard(null);
                setCards(newCards);
                setProcessing(false);
            });
        } catch (e: any) {
            setDisplayedCard(null);
            setProcessing(false);
            console.error(e);
        }
    }

    useEffect(() => {
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
                        });
                    });
                }
            });
        }
    }, []);

    return (
        <>
        {user? 
        <>
            <Topbar/>
            <div style={{marginTop: "80px", textAlign: "center"}}>
                {!loading? 
                <>
                    {editingTitle? 
                    <div style={{textAlign: "center"}}>
                        {error && <p style={{textAlign: "center"}} className="error">{error}</p>}
                        <input value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} style={{maxWidth: "min(90%, 400px)", margin: "auto"}} maxLength={45}></input>
                        <button style={{width: "50px", height: "40px", margin: "10px", padding: "0px"}} onClick={() => {
                            setEditingTitle(false);
                            setError("");
                            setNewTitle("");
                        }}><i className="fa-solid fa-xmark"></i></button>
                        <button style={{width: "50px", height: "40px", margin: "10px", padding: "0px"}} onClick={() => {
                            editTitle();
                        }}><i className="fa-solid fa-check"></i></button>
                    </div>
                    
                    :
                    <h1>{deck!.deckName}<i style={{margin: "15px"}} className="fa-solid fa-pen-to-square text-button" onClick={()=>{
                        setEditingTitle(true);
                        setNewTitle(deck!.deckName);
                    }}></i></h1>
                    }
                    <div className="cards-container">
                        <div className="card-preview" style={{margin: "20px"}} onClick={() => {
                            editCard({id: 0, image: "", cardFront: "", cardBack: ""});
                            setAddingCard(true);
                        }}>
                            <i style={{fontSize: "30px"}} className="fa-solid fa-plus"></i>
                        </div>
                        {cards.map((card: Card) => 
                        <div style={{display: "flex", margin: "20px"}}>
                            <div className={"card-preview"} key={card.id} onClick={() => {
                                editCard(card);
                            }}>
                                <h3>{card.cardFront}</h3>
                            </div>
                            <button className="circle-button" style={{marginLeft: "-15px", marginTop: "-15px"}} onClick={() => {
                                deleteCard(card);
                            }}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        )}
                    </div>
                    <button style={{width: "100px", margin: "10px"}} onClick={() => {
                        navigate("/");
                    }}>Back</button>
                    {displayedCard && 
                    <div style={{width: "100vw", height: "100vh", position: "fixed", top: "0px", backgroundColor: "rgba(0,0,0,0.5)"}}>
                        <div className="inspected-card">
                            <div className="inspected-card-tabs">
                                <div className={"inspected-card-tab " + (activeTab == 0? "open" : "")} onClick={() => setActiveTab(0)}>
                                    Front
                                </div>
                                <div className={"inspected-card-tab " + (activeTab == 1? "open" : "")} onClick={() => setActiveTab(1)}>
                                    Back
                                </div>
                                <div className={"inspected-card-tab " + (activeTab == 2? "open" : "")} onClick={() => setActiveTab(2)}>
                                    Image
                                </div>
                                <div className={"inspected-card-tab-highlight t" + activeTab}></div>
                            </div>
                            <div className="inspected-card-display">
                                {
                                    activeTab==0? <>
                                        <h1 className="inspected-card-header">Front Text:</h1>
                                        <textarea value={newFront} onChange={(e) => setNewFront(e.target.value)} className="inspected-card-textarea" maxLength={255}></textarea>
                                    </> : activeTab == 1? <>
                                        <h1 className="inspected-card-header">Back Text</h1>
                                        <textarea value={newBack} onChange={(e) => setNewBack(e.target.value)} className="inspected-card-textarea" maxLength={255}></textarea>
                                    </> : <>
                                        <h1 className="inspected-card-header">Image:</h1>
                                        <div className="inspected-card-image" style={{border: (imagePreview? "none" : "1px solid #8d8d8d")}}>
                                            {newImage? <div className="uploaded-image-container">
                                                <img className="uploaded-image" src={imagePreview}>
                                                </img>
                                                <div className="circle-button" style={{marginLeft: "-15px", marginTop: "-15px"}} onClick={() => {
                                                    setNewImage(null);
                                                    setImagePreview("");
                                                }}>
                                                    <i className="fa-solid fa-xmark"></i>
                                                </div>
                                            </div> :
                                            <>
                                                <input style={{display: "none"}} type="file" id="img" name="img" accept="image/*" onChange={(e) => {
                                                    if (e.target.files) {
                                                        setNewImage(e.target.files[0]);
                                                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                                                    } else {
                                                        setNewImage(null);
                                                    }   
                                                }}></input>
                                                <label htmlFor="img" className={"text-button"} style={{textAlign: "center"}}>
                                                    <i className="fa-solid fa-upload" style={{margin: "auto"}}></i>
                                                    <h3 style={{fontSize: "20px", margin: "auto"}}>Upload Image</h3>
                                                </label>
                                                
                                            </>
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                            <div className={"inspected-card-button-container"}>
                                {error && <p className="error" style={{margin: "0px 20px", padding: "10px"}}>{error}</p>}
                                <button className={"inspected-card-button " + (processing? "disabled" : "")} disabled={processing} onClick={() => {
                                    setDisplayedCard(null);
                                    setAddingCard(false);
                                }}>Cancel</button>
                                {activeTab == 1 && <button className={"inspected-card-button " + (processing? "disabled" : "")} disabled={processing} onClick={() => {
                                    setProcessing(true);
                                    generateBack();
                                }}>Generate</button>}
                                {!addingCard?
                                <button className={"inspected-card-button " + (processing? "disabled" : "")} disabled={processing} onClick={() => {
                                    if (newFront === "" || newBack === "") {
                                        setError("Front and back of card can't be empty")
                                    } else {
                                        setProcessing(true);
                                        let encodedImage = "";
                                        if (newImage) {
                                            const reader = new FileReader();
                                            reader.readAsDataURL(newImage);
                                            reader.onload = () => {
                                                encodedImage = reader.result as string;
                                                updateCard(encodedImage);
                                            }
                                        } else {
                                            updateCard("");
                                        }
                                    }
                                }}>Save</button> 
                                :
                                <button className={"inspected-card-button " + (processing? "disabled" : "")} disabled={processing} onClick={() => {
                                    if (newFront === "" || newBack === "") {
                                        setError("Front and back of card can't be empty")
                                    } else {
                                        setProcessing(true);
                                        let encodedImage = "";
                                        if (newImage) {
                                            const reader = new FileReader();
                                            reader.readAsDataURL(newImage);
                                            reader.onload = () => {
                                                encodedImage = reader.result as string;
                                                addCard(encodedImage);
                                            }
                                        } else {
                                            addCard("");
                                        }
                                    }
                                }}>Add</button>
                                }
                            </div>
                        </div>
                    </div>
                    
                    }
                </>
                :
                <div className={"loader"}></div>
                }
            </div>
        </>
        :
        <div className="centered-container" style={{textAlign: "center", height: "100vh"}}>
            <div>
                <h1>Not Logged In</h1>
                <button style={{display: "block", margin: "auto", width: "100px"}} onClick={(e) => navigate("/")}>Home</button>
            </div>
            
        </div>
        }
        </>
        
    );
}

export default DeckEditor;