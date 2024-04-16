import React, { useState, useEffect, useCallback } from 'react';
import pokemonJson from "../pokemon.json";
import pokemonTypeJson from "../pokemonType.json";
import Pokemon from './Pokemon';


const Calendar = () => {
  const [allPokemons, setAllPokemons] = useState([]);

  const createPokemonObject = useCallback((results) => {
    const allPromises = results.map(pokemon => {
      const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`;
      return fetch(pokemonUrl)
        .then(res => res.json())
        .then(async (data) => {
          const _image = data.sprites.other["official-artwork"].front_default;
          const _type = data.types[0].type.name;
          const japanese = await translateToJapanese(data.name, _type);
          return {
            id: data.id,
            name: data.name,
            image: _image,
            type: _type,
            jpName: japanese.name,
            jpType: japanese.type
          };
        });
    });

    Promise.all(allPromises).then(newList => {
      setAllPokemons(currentList => {
        const existingIds = new Set(currentList.map(p => p.id));
        const filteredNewList = newList.filter(p => !existingIds.has(p.id));
        return [...currentList, ...filteredNewList];
      });
    });
  }, []);

  const translateToJapanese = async (name, type) => {
    const pokemonEntry = pokemonJson.find(
      (pokemon) => pokemon.en.toLowerCase() === name.toLowerCase()
    );

    // ポケモンが見つからない場合はデフォルト値を設定
    const jpName = pokemonEntry ? pokemonEntry.ja : '不明';
    const jpType = pokemonTypeJson[type] || '不明';

    return { name: jpName, type: jpType };
  };

  const calculateIdRange = (buttonNumber) => {
    const startId = buttonNumber * 100 + 1;
    const endId = startId + 30;
    return { startId, endId };
  };

  const handleButtonClick = async (buttonNumber) => {
    const { startId, endId } = calculateIdRange(buttonNumber);

    const pokemonPromises = Array(endId - startId + 1).fill().map(async (_, index) => {
      const id = startId + index;
      try {
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const response = await fetch(pokemonUrl);
        const pokemonData = await response.json();
        const _image = pokemonData.sprites.front_default;
        const _type = pokemonData.types[0].type.name;
        const japanese = await translateToJapanese(pokemonData.name, _type);
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          image: _image,
          type: _type,
          jpName: japanese.name,
          jpType: japanese.type
        };
      } catch (error) {
        const defaultPokemonUrl = `https://pokeapi.co/api/v2/pokemon/132`;
        const defaultResponse = await fetch(defaultPokemonUrl);
        const defaultPokemonData = await defaultResponse.json();
        const _defaultImage = defaultPokemonData.sprites.other["official-artwork"].front_default;
        return {
          id: id,
          name: "Not Found",
          image: _defaultImage,
          type: "unknown",
          jpType: "不明"
        };
      }
    });

    const pokemonData = await Promise.all(pokemonPromises);
    setAllPokemons(pokemonData);
  };

  useEffect(() => {
    handleButtonClick(1);
  }, []);

  return (
    <>
      <div>
        {[...Array(12)].map((_, index) => (
          <button className='calendar_button' key={index} onClick={() => handleButtonClick(index + 1)}>
            {index + 1}月
          </button>
        ))}
      </div>
      <div className="calendar">
        {allPokemons.sort((a, b) => a.id - b.id).map((pokemon, index) => (
          <Pokemon
            id={pokemon.id}
            name={pokemon.name}
            image={pokemon.image}
            iconImage={pokemon.iconImage}
            type={pokemon.type}
            key={index}
            jpName={pokemon.jpName}
            jpType={pokemon.jpType}
          />
        ))}
      </div>
    </>
  );
}

export default Calendar;
