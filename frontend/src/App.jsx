import { useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

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
          <div>
            <a target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="word">
            <h1>React + Express Fullstack App</h1>
            <button onClick={fetchWord}>Get Word</button>
            {word && <p>Word from backend: {word}</p>}
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </>
  );
}

export default App;
