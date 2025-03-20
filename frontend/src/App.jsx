import { useState } from 'react';
import Home from './pages/Home.jsx';
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx';
import Investing from './pages/Investing.jsx';


function App() {
 
  return (
    <>
    <NavBar />
    <main className = "main-content">

    <Routes>
      <Route path = "/" element = {<Home />}/>
      <Route path = "/investing" element = {<Investing/>}/>

    </Routes>

   </main>
   </>

  );
}

export default App;
