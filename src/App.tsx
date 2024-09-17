import './App.css'
import Home from "./components/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Game from "./components/Game.tsx";

function App() {

  return (
      <BrowserRouter>
        <Routes>
            <Route index element={<Home />} />
            <Route path="/game/:id" element={<Game />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
