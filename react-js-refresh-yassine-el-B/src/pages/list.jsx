import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavorites, saveFavorites } from "../storage/storage.jsx";

export default function List() {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const limit = 50;

  const [favorites, setFavorites] = useState(getFavorites());

  const toggleFavorite = (pokemonItem) => {
    const exists = favorites.some(f => f.name === pokemonItem.name);
    const updated = exists
      ? favorites.filter(f => f.name !== pokemonItem.name)
      : [...favorites, pokemonItem];
    setFavorites(updated);
    saveFavorites(updated);
  };

  const loadPokemon = () => {
    if (loading) return;
    setLoading(true);

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon((prev) => {
          const all = [...prev, ...data.results];
          const unique = Array.from(new Map(all.map((p) => [p.name, p])).values());
          return unique;
        });
        setOffset((prev) => prev + limit);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  const filtered = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Pokédex</h1>

      {/* Favorieten bovenaan */}
      {favorites.length > 0 && (
        <div className="favorites-bar">
          <h2 className="favorites-title">Favorieten ❤️</h2>
          <ul className="favorites-list">
            {favorites.map((p, index) => {
              const id = p.url.split("/").filter(Boolean).pop();
              return (
                <li key={index} className="favorite-item">
                  <Link to={`/detail/${id}`}>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                      alt={p.name}
                      className="favorite-img"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <input
        type="text"
        placeholder="Zoek Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <ul className="pokemon-list">
        {filtered.map((p, index) => {
          const id = p.url.split("/").filter(Boolean).pop();
          return (
            <li key={index} className="pokemon-item">
              <Link to={`/detail/${id}`}>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={p.name}
                  className="pokemon-img"
                />
                <span className="pokemon-name">{p.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {loading && <p className="loading-text">Laden...</p>}
      {!loading && (
        <button onClick={loadPokemon} className="load-more-button">
          Meer Pokémon
        </button>
      )}
    </div>
  );
}
