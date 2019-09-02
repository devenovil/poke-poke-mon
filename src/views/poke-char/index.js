import React, { Component } from "react";
import "./style.scss";
import { safeDeepGet, safeDeepGetWithType } from "../../lib/json";
import { isFunction } from "../../lib/object";

class PokeChar extends Component {
  constructor(props) {
    super(props);
    this.onPokemonSelect = this.onPokemonSelect.bind(this);
  }

  onPokemonSelect(pokemon) {
    let onPokemonSelect = safeDeepGet(this, ["props", "onPokemonSelect"]);
    if (isFunction(onPokemonSelect)) {
      onPokemonSelect(pokemon);
    }
  }

  render() {
    let pokemon = safeDeepGetWithType(this, ["props", "pokemon"], {});
    let dataGrid = safeDeepGetWithType(this, ["props", "dataGrid"], {});
    let _this = this;
    const MON_INDEX_KEY = 6;
    const SPRITE_STR =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
    var MON_NUM = pokemon.url.split("/")[MON_INDEX_KEY];

    return (
      <div className="segAlign" data-grid={dataGrid}>
        <div
          onClick={() => _this.onPokemonSelect(pokemon)}
          className="ui card selectCard"
        >
          <div className="image">
            <img alt={pokemon.name} src={SPRITE_STR + MON_NUM + ".png"} />
          </div>
          <div className="content">
            <h2 className="selectionName">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

export default PokeChar;
