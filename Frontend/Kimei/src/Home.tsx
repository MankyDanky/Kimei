
import Decks from "./Decks";
import { UserContext } from "./main";

import { useContext, useEffect, useState } from "react";
import Topbar from "./Topbar";

function Home() {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [user, setUser] = useContext(UserContext);
    const [loggingIn, setLoggingIn] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        if (localStorage.getItem("user")) {
            setUser(JSON.parse(localStorage.getItem("user")!));
        }
    }, []);

    

    async function signUp() {
        setLoading(true);
        if (email == "" || username == "" || password == "" || confirmPassword == "") {
            setError("Please fill out all fields");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email) === false) {
            setError("Invalid email");
            setLoading(false);
            return;
        }

        setError("");
        const res = await fetch("http://localhost:8080/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
                "email": email
            })
        });
        if (res.status === 201) {
            res.json().then((data) => {
                setUser(data);
                localStorage.setItem("user", JSON.stringify(data));
                setLoading(false);
            });
        } else {
            setError("Email already in use");
            setLoading(false);
        }
    }

    async function login() {
        setLoading(true);
        if (email == "" || password == "") {
            setError("Please fill out all fields");
            return;
        }

        setError("");
        try {
            const res = await fetch("http://localhost:8080/user/login", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "password": password,
                    "email": email,
                    "username": ""
                })
            });
            
            if (res.status === 200) {
                res.json().then((data) => {
                    setUser(data);
                    localStorage.setItem("user", JSON.stringify(data));
                    setLoading(false);
                });
            } else {
                setError("Invalid email or password");
                setLoading(false);
            }
        } catch (e: unknown) {
            setError("Invalid email or password");
            setLoading(false);
        }
    }

    return (
        <>
            {user ? (
                <div style={{position: "relative", overflowY: "scroll"}}>
                    <Topbar/>
                    <Decks {...user}/>
                </div>
                
            ) : (
                <div className="centered-container">
                    {loggingIn ? (
                        <div className="account-container">
                            <h2>Login</h2>
                            {error && <div className="error">{error}</div>}
                            <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Email" />
                            <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" placeholder="Password" />
                            <button onClick={() => login()} disabled={loading} className={(loading? "disabled" : "")}>Login</button>
                            <div style={{textAlign: "left", width: "100%", marginBottom: "25px"}}>Don't have an account? <span className="link-text" onClick={(e) => setLoggingIn(false)}>Sign Up</span></div>
                        </div>
                    ) : (
                        <div className="account-container">
                            <h2>Sign Up</h2>
                            {error && <div className="error">{error}</div>}
                            <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Email" />
                            <input value={username} onChange={(e)=> setUsername(e.target.value)} type="text" placeholder="Username" />
                            <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" placeholder="Password" />
                            <input value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" />
                            
                            <button onClick={() => signUp()} disabled={loading} className={(loading? "disabled" : "")}>Sign Up</button>
                            <div style={{textAlign: "left", width: "100%", marginBottom: "25px"}}>Already have an account? <span className="link-text" onClick={(e) => setLoggingIn(true)}>Login</span></div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default Home;