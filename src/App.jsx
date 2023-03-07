import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {
  ThreeApp
} from "./assets/ThreeApp.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>WebGL App in Three.js</h1>
      <ThreeApp></ThreeApp>
    </div>
  )
}

export default App
