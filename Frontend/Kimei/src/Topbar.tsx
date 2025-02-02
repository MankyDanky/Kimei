import { useContext } from "react";
import { UserContext } from "./main";
import { useNavigate } from "react-router-dom";

function Topbar () {
    const navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);

    return (
    <div className="topbar">
        <span style={{cursor: "pointer", display: "flex", alignItems: "center"}} onClick={() => navigate("/")}>
            <h3>Kimei</h3>
            <img src="/logo.png" alt="logo" style={{height: "32px", width: "32px"}} />
        </span>
        
        <p className={"text-button"} style={{marginLeft: "auto", cursor: "pointer"}} onClick={() => {
            setUser(null);
            localStorage.removeItem("user");
        }}>Logout</p>
     </div>
    )
}

export default Topbar;