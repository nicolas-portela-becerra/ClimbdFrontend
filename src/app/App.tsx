import { Routes, Route } from 'react-router-dom'
import Login from "../routes/login.tsx"


function App() {
  return (
    <main>
        <h1>Climbd</h1>
      <Routes>
          <Route path="/" element={ <Login /> } />
      </Routes>
    </main>
    
  )
}

export default App
