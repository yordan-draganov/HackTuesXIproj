import { Link, useNavigate } from "react-router-dom"
import "../css/NavBar.css"
import React from "react"
import { useUser } from "../context/userContext"
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";


function NavBar(){
    const { user } = useUser();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
        await signOut(auth);
        navigate("/login");
        } catch (error) {
        console.error("Error signing out:", error);
        }
    };

    return <nav className="navbar">
        <div className = "navbar-brand">
            <Link to = "/"> SMI </Link>
        </div>
        <div className = "navbar-links">
            <Link to = "/" className="nav-link-home">Home</Link>
            {user ? <>
                <Link to = "/investing" className="nav-link-investing">Investing</Link>
                <Link to = "#" onClick={handleLogout} className="nav-link-login">
                    Logout
                </Link>
            </> : 
            <>
                <Link to = "/login" className="nav-link-login">Login</Link>
                <Link to = "/signup" className="nav-link-login">Sign up</Link>
            </>}
        </div>
    </nav>
}

export default NavBar