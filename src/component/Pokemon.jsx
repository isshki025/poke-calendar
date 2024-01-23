import React from "react";
import '../styles/Pokemon.css'

const Pokemon = ({ id, name, image, type, jpName, jpType, }) => {
  return (
    <div className="pokemon">
      <p className="pokemon_number">0{id}</p>
      <img className="pokemon_img" src={image ?? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/unknown.png"} alt={name} />
      <div className="pokemon-wrapper">
        <h2 className="pokemon_name">{jpName ?? "???"}</h2>
        <h3 className={`pokemon_type ${type}`}>{jpType ?? type}</h3>
      </div>
    </div>
  );
}

export default Pokemon;