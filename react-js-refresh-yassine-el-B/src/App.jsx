import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home.jsx";
import List from "./pages/list.jsx";
import Detail from "./pages/details.jsx";
import Team from "./pages/team.jsx";
function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Home</Link> |{" "}
        <Link to="/list">Pokémon Lijst</Link>
        <Link to="/team">Mijn Team</Link>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

