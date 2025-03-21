import { Link } from "react-router-dom"
import "../css/NavBar.css"
import React from "react"


function NavBar(){
    return <nav className="navbar">
        <div className = "navbar-brand">
            <Link to = "/"> BLOCK 20 </Link>
        </div>
        <div className = "navbar-links">
            <Link to = "/" className="nav-link-home">Home</Link>
            <Link to = "/investing" className="nav-link-investing">Investing</Link>
            <Link to = "/login" className="nav-link-login">Login</Link>
            <Link to = "/signup" className="nav-link-login">Sign up</Link>
        </div>
    </nav>
}

export default NavBar