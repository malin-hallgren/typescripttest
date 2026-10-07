import { useState, useEffect } from 'react'
import dummyImage from './assets/dummyimg.jpg'
import './App.css'

function App() {
  const [status, setStatus] = useState('idle')
  const [city, setCity] = useState('')
  const [cluesRevealed, setCluesRevealed] = useState(1)
  const [points, setPoints] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({1 : '', 2: '', 3: ''})

  const clues = [
    'Den här storstaden i Skandinavien har ett stadsvapen hämtat från ett annat land.',
    'Staden är landets enda med en tunnelbana',
    'Staden ligger på 14 öar och har 57 broar',
    'Ibland kalls invånarna nedslående för fiskmåsar',
    'Hur é leeeget? Välkommen till Sveriges huvudstad!'
  ]

  const pointsPerClue: Record<number, number> = {
    1: 10,
    2: 8,
    3: 6,
    4: 4,
    5: 2
  }

  const questions: Record<number, { question: string, answer: string }> = {
    1: { question: 'Vad heter regalskeppet som finns på ett museum i staden', answer: 'vasa' },
    2: { question: 'Vilken är den äldsta tunnelbanelinjen i staden?', answer: 'grön' },
    3: { question: 'Vad heter nöjesfältet som ligger i staden?', answer: 'gröna lund' },
  }

  const submitCity = () => {
    setStatus('loading')
    if (city.trim().toLowerCase() === 'stockholm') {
      setStatus('success')
      setPoints(pointsPerClue[cluesRevealed])
    }
    else {
      setStatus('error')
    }
  }

  const submitAnswers = () => {
    for (const [key, { answer }] of Object.entries(questions)) {
      if (answers[parseInt(key)].trim().toLowerCase() === answer) {
        setPoints(prevPoints => prevPoints + 3)
      }
    }
    setStatus('completed')
  }

  useEffect(() => {
    setStatus('idle')
  }, [city])

  return (
    <div className="app">
      <img src= {dummyImage} alt="Dummy" className="dummy-image" />
      {status !== 'success' && status !== 'completed' &&
      <>
        <ul>
          {
            clues.map((clue, index) => (
              <li key={index}>
                {index < cluesRevealed ? clue : ''}
              </li>
            ))
          }
        </ul>
        <button onClick={() => setCluesRevealed(cluesRevealed + 1)} disabled={cluesRevealed >= clues.length}>Reveal next clue</button>
        <form>
          <input type="text" placeholder="Enter city" required value={city} onChange={(e) => setCity(e.target.value)} />
          <button type="button" onClick={submitCity}>Submit</button>
        </form>
      </>   
      }
      {status === 'error' && <p>Wrong city entered.</p>}
      {status === 'success' &&
        <>
          <h1>Välkommen till Stockholm!</h1>
          <p>Du fick {points} poäng så här långt. Nu är det dags för en liten frågesport!</p>
          <form>
            {Object.entries(questions).map(([key, { question}]) => (
              <div key={key}>
                <label>{question}</label>
                <input type="text" value={answers[parseInt(key)]} onChange={(e) => setAnswers({ ...answers, [parseInt(key)]: e.target.value })} required />
              </div>
            ))}
          </form>
          <button onClick={() => {
            submitAnswers()
          }}>Submit answers</button>
        </>
      }
      {status === 'completed' && <p>Frågesporten är klar! Du fick totalt {points} poäng.</p>}
    </div>
  )
}

export default App
