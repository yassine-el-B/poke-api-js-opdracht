import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFavorites, saveFavorites, getTeams, saveTeams, addPokemonToTeam, removePokemonFromTeam } from "../storage/storage.jsx";

export default function Detail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [favorites, setFavorites] = useState(getFavorites());
  const [teams, setTeams] = useState(getTeams());
  const [showTeamSelect, setShowTeamSelect] = useState(false);

  // Keep favorites functionality
  const toggleFavorite = (pokemonItem) => {
    const exists = favorites.some(f => f.name === pokemonItem.name);
    const updated = exists
      ? favorites.filter(f => f.name !== pokemonItem.name)
      : [...favorites, pokemonItem];
    setFavorites(updated);
    saveFavorites(updated);
  };

  const addToTeam = (teamName) => {
    const pokemonItem = {
      name: pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
    };
    const updatedTeams = addPokemonToTeam(teamName, pokemonItem);
    setTeams(updatedTeams);
    setShowTeamSelect(false);
  };

  const isFavorite = pokemon ? favorites.some(f => f.name === pokemon.name) : false;
  const isInAnyTeam = pokemon ? Object.values(teams).some(
    team => team.some(p => p.name === pokemon.name)
  ) : false;

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(data => setPokemon(data));
  }, [id]);

  if (!pokemon) return <p>Laden...</p>;

  return (
    <div className="pokemon-card">
      <h1 className="pokemon-name">{pokemon.name}</h1>

      <button
        onClick={() =>
          toggleFavorite({ name: pokemon.name, url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}` })
        }
        className="favorite-button"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <button
        onClick={() => setShowTeamSelect(true)}
        className="team-button"
      >
        <img
          src={isInAnyTeam ? "/small-pokeball-icon-4.jpg" : "/pokeball-4yvqs5y6vaux3kxhg3zcba.webp"}
          alt="Pokéball toggle"
          className="team-button-img"
        />
      </button>

      <img
        src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
        alt={pokemon.name}
        className="pokemon-image"
      />

      <div className="pokemon-info">
        <p><strong>HP:</strong> {pokemon.stats.find(s => s.stat.name === "hp").base_stat}</p>
        <p><strong>Attack:</strong> {pokemon.stats.find(s => s.stat.name === "attack").base_stat}</p>
        <p><strong>Defense:</strong> {pokemon.stats.find(s => s.stat.name === "defense").base_stat}</p>
        <p><strong>Speed:</strong> {pokemon.stats.find(s => s.stat.name === "speed").base_stat}</p>
        <p><strong>Hoogte:</strong> {pokemon.height}</p>
        <p><strong>Gewicht:</strong> {pokemon.weight}</p>
        <p className="full-row"><strong>Type:</strong> {pokemon.types.map(t => t.type.name).join(", ")}</p>
        <p className="full-row"><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(", ")}</p>
        <p className="full-row"><strong>Moves:</strong> {pokemon.moves.slice(0,5).map(m => m.move.name).join(", ")}</p>
      </div>

      {showTeamSelect && (
        <div className="team-select-modal">
          <div className="team-select-content">
            <h3>Kies een team</h3>
            {Object.keys(teams).map(teamName => (
              <button
                key={teamName}
                onClick={() => addToTeam(teamName)}
                className="team-select-button"
              >
                {teamName}
              </button>
            ))}
            <button 
              onClick={() => setShowTeamSelect(false)}
              className="close-modal-button"
            >
              Annuleer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
