// storage.jsx
export const getFavorites = () => {
  try {
    const data = localStorage.getItem("favorites");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading favorites from storage:", e);
    return [];
  }
};

export const saveFavorites = (favorites) => {
  try {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } catch (e) {
    console.error("Error saving favorites to storage:", e);
  }
};

export const getTeams = () => {
  try {
    // First try to get existing single team for backward compatibility
    const oldTeam = localStorage.getItem("team");
    if (oldTeam) {
      const teamData = JSON.parse(oldTeam);
      // Migrate old team to new format
      localStorage.removeItem("team");
      const newTeams = { 'Team 1': teamData };
      localStorage.setItem("pokemon-teams", JSON.stringify(newTeams));
      return newTeams;
    }

    // Try to get new team format
    const teams = localStorage.getItem("pokemon-teams");
    return teams ? JSON.parse(teams) : { 'Team 1': [] };
  } catch (e) {
    console.error("Error reading teams:", e);
    return { 'Team 1': [] };
  }
};

export const saveTeams = (teams) => {
  try {
    if (!teams || typeof teams !== 'object') {
      throw new Error('Invalid teams data');
    }
    localStorage.setItem("pokemon-teams", JSON.stringify(teams));
  } catch (e) {
    console.error("Error saving teams:", e);
  }
};

export const addPokemonToTeam = (teamName, pokemon) => {
  try {
    const teams = getTeams();
    teams[teamName] = teams[teamName] || [];
    
    // Ensure we don't add duplicates
    if (!teams[teamName].some(p => p.name === pokemon.name)) {
      teams[teamName].push(pokemon);
      saveTeams(teams);
    }
    return teams;
  } catch (e) {
    console.error("Error adding Pokemon to team:", e);
    return getTeams();
  }
};

export const removePokemonFromTeam = (teamName, pokemonName) => {
  try {
    const teams = getTeams();
    if (teams[teamName]) {
      teams[teamName] = teams[teamName].filter(p => p.name !== pokemonName);
      saveTeams(teams);
    }
    return teams;
  } catch (e) {
    console.error("Error removing Pokemon from team:", e);
    return getTeams();
  }
};
