import Home from './pages/Home.jsx';
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx';
import Investing from './pages/Investing.jsx';
import React from "react"
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

function App() {
 
  return (
    <>
    <NavBar />
    <main className = "main-content">

    <Routes>
      <Route path = "/" element = {<Home />}/>
      <Route path = "/investing" element = {<Investing/>}/>
      <Route path = "/login" element = {<Login/>}/>
      <Route path = "/signup" element = {<Signup/>}/>
    </Routes>

   </main>
   </>

  );
}

export default App;
