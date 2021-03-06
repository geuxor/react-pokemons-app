import pokemonApi from "../services/pokemonApi";
const POKEMON_CACHE = "POKEMON_CACHE";

export const currentTime = () => {
  return Date.now();
};

export const buildPokemonCache = async (count, onCachedEnabled) => {
  const existingCachedData = getPokemonFromLocalStorage();
  const cachedAllData = [];
  let pokeCachedData = {};
  if (existingCachedData.length !== count) {
    let y = 0;
    for (let i = 1; i <= count; i++) {
      try {
        const pokemonDetails = await pokemonApi.getPokemonDetails(i + y);
        if (pokemonDetails) {
          pokeCachedData.name = pokemonDetails.data.name;
          pokeCachedData.image =
            pokemonDetails.data.sprites.other["official-artwork"].front_default;
          pokeCachedData.height = pokemonDetails.data.height;
          pokeCachedData.weight = pokemonDetails.data.weight;
          pokeCachedData.abilities = pokemonDetails.data.abilities;
          pokeCachedData.url = `https://pokeapi.co/api/v2/pokemon/${pokemonDetails.data.id}`;
          pokeCachedData.id = pokemonDetails.data.id;
          cachedAllData.push(pokeCachedData);
          pokeCachedData = {};
          if (pokemonDetails.data.id === 898) {
            y = 9102;
          }
        } else {
          cachedAllData.push(pokeCachedData);
        }
      } catch (err) { }
    }
    setPokemonToLocalStorage(cachedAllData);
    onCachedEnabled(true);
  }
};

export const getPokemonFromLocalStorage = () => {
  let pokemonCache = [];
  try {
    const data = localStorage.getItem(POKEMON_CACHE);
    if (data) {
      pokemonCache = JSON.parse(data);
    }
  } catch (e) {
    console.error(e.message);
  }
  return pokemonCache;
};

export const setPokemonToLocalStorage = (pokemonCache, value) => {
  cleanUpStorage();
  try {
    localStorage.setItem(POKEMON_CACHE, JSON.stringify(pokemonCache));
  } catch (e) {
    console.log(e);
  }
};

export const cleanUpStorage = () => {
  localStorage.removeItem(POKEMON_CACHE);
};
