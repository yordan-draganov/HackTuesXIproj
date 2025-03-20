import { useState } from 'react';
import Home from './pages/Home.jsx';
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx';
import Investing from './pages/Investing.jsx';


function App() {
  const [word, setWord] = useState('');

  const fetchWord = () => {
    fetch('http://localhost:5000/api/message')
      .then((response) => response.json())
      .then((data) => setWord(data.word))
      .catch((error) => console.error('Error fetching word:', error));
  };

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
