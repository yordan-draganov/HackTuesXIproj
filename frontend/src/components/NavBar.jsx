import { Link } from "react-router-dom"
import "../css/NavBar.css"


function NavBar(){
    return <nav className="navbar">
        <div className = "navbar-brand">
            <Link to = "/"> INVESTING APP </Link>
        </div>
        <div className = "navbar-links">
            <Link to = "/" className="nav-link-home">Home</Link>
        </div>
    </nav>
}

export default NavBar