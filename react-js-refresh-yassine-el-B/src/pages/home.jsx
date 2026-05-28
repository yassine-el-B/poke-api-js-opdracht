import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <img src="./International_Pokémon_logo.svg.png" alt="Pokémon page" />
      <img src="./pokemonballfreegraphics.jpg" alt="Pokémon page"  />
      <Link to="/list" className="button">Bekijk Pokémon</Link>
    </div>
  );
}


