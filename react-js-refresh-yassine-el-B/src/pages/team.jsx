import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Team() {
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('pokemon-teams');
    return savedTeams ? JSON.parse(savedTeams) : { 'Team 1': [] };
  });
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showTeamSelect, setShowTeamSelect] = useState(false);

  useEffect(() => {
    localStorage.setItem('pokemon-teams', JSON.stringify(teams));
  }, [teams]);

  const openTeamSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
    setShowTeamSelect(true);
  };

  const addToTeam = (teamName) => {
    if (!selectedPokemon) return;

    const teamPokemon = teams[teamName] || [];
    const exists = teamPokemon.some(p => p.name === selectedPokemon.name);

    if (!exists) {
      setTeams({
        ...teams,
        [teamName]: [...teamPokemon, selectedPokemon]
      });
    }
    setShowTeamSelect(false);
    setSelectedPokemon(null);
  };

  const removeFromTeam = (teamName, pokemon) => {
    setTeams({
      ...teams,
      [teamName]: teams[teamName].filter(p => p.name !== pokemon.name)
    });
  };

  const createNewTeam = (e) => {
    e.preventDefault();
    if (newTeamName && !teams[newTeamName]) {
      setTeams({
        ...teams,
        [newTeamName]: []
      });
      setNewTeamName('');
    }
  };

  const deleteTeam = (teamName) => {
    if (Object.keys(teams).length > 1) {
      const newTeams = { ...teams };
      delete newTeams[teamName];
      setTeams(newTeams);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Mijn Teams</h1>

      {/* Create New Team Form */}
      <form onSubmit={createNewTeam} className="create-team-form">
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Nieuwe team naam"
          className="team-input"
        />
        <button type="submit" className="create-team-button">
          Maak Nieuw Team
        </button>
      </form>

      {/* Teams Grid */}
      <div className="teams-grid">
        {Object.entries(teams).map(([teamName, pokemon]) => (
          <div key={teamName} className="team-container">
            <div className="team-header">
              <h2>{teamName}</h2>
              <button 
                onClick={() => deleteTeam(teamName)}
                className="delete-team-button"
                disabled={Object.keys(teams).length <= 1}
              >
                ×
              </button>
            </div>
            {pokemon.length === 0 ? (
              <p className="empty-text">Dit team is leeg!</p>
            ) : (
              <ul className="team-list">
                {pokemon.map((p, index) => {
                  const id = p.url.split("/").filter(Boolean).pop();
                  return (
                    <li key={index} className="team-item">
                      <Link to={`/detail/${p.name}`}>
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                          alt={p.name}
                          className="pokemon-sprite"
                        />
                      </Link>
                      <span className="pokemon-name">{p.name}</span>
                      <button
                        onClick={() => removeFromTeam(teamName, p)}
                        className="team-button"
                      >
                        <img
                          src="/small-pokeball-icon-4.jpg"
                          alt="Verwijder"
                          className="pokeball-icon"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Team Selection Modal */}
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
