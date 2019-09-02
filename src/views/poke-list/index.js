import React, { Component } from "react";
import { safeDeepGetWithType, safeDeepGet } from "../../lib/json";
import { isFunction } from "../../lib/object";

import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import store from "../../redux/store";

const ResponsiveGridLayout = WidthProvider(Responsive);

class PokeList extends Component {
  constructor(props) {
    super(props);
    let storeValue = store.getState();

    let pokemons = safeDeepGetWithType(
      storeValue,
      ["owned_pokemon", "list"],
      {}
    );
    this.state = {
      pokemons
    };
    this.onPokemonSelect = this.onPokemonSelect.bind(this);
  }

  onPokemonSelect(pokemon) {
    let onPokemonSelect = safeDeepGet(this, ["props", "onPokemonSelect"]);
    if (isFunction(onPokemonSelect)) {
      onPokemonSelect(pokemon);
    }
  }
  render() {
    let pokemons = safeDeepGetWithType(this, ["state", "pokemons"], {});
    let listPokemon = safeDeepGetWithType(this, ["props", "listPokemon"], []);
    let contentWidth = safeDeepGetWithType(
      this,
      ["props", "contentWidth"],
      window.innerWidth
    );
    let _this = this;

    const MON_INDEX_KEY = 6;
    const SPRITE_STR =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

    let pokeList = [];

    let w = 1;
    let h = 1;

    let counterX = 0;
    let counterY = 0;

    var colLimity = 1;
    if (contentWidth >= 450.01 && contentWidth <= 931.01) {
      colLimity = 0;
    }

    for (let i = 0; i < listPokemon.length; i++) {
      let pokemon = listPokemon[i];
      let MON_NUM = pokemon.url.split("/")[MON_INDEX_KEY];

      let size = safeDeepGetWithType(pokemons, [pokemon.name, "size"], 0);

      let notShowOwned = size === 0 ? true : false;

      let height = 100;
      if (!notShowOwned) {
        height = 50;
      }

      let x = counterX;
      let y = counterY;

      if (counterX <= colLimity) {
        counterX++;
      } else {
        counterX = 0;
        counterY++;
      }

      pokeList.push(
        <div
          key={i}
          className="card pokeList"
          data-grid={{ x, y, w, h, isResizable: false, isDraggable: false }}
        >
          <div
            className="row"
            style={{ margin: 0 }}
            onClick={() => _this.onPokemonSelect(pokemon)}
          >
            <span className="image">
              <img alt={pokemon.name} src={SPRITE_STR + MON_NUM + ".png"} />
            </span>
            <span>
              <div className="centeringItemVertical" style={{ height }}>
                <span className="selectionName">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </span>
              </div>
              {notShowOwned ? null : (
                <div
                  className="centeringItemVertical"
                  style={{ height, fontSize: 11, fontStyle: "italic" }}
                >
                  <span>Owned : {size}</span>
                </div>
              )}
            </span>
          </div>
        </div>
      );
    }
    return (
      <div
      // className="mon-list ui grid container center aligned"
      // style={{ overflow: "auto", maxHeight: 800 }}
      >
        <ResponsiveGridLayout
          className="layout"
          // onResize={this.onResize}
          breakpoints={{ lg: 1200, md: 931, sm: 768, xs: 450, xxs: 0 }}
          cols={{ lg: 3, md: 3, sm: 2, xs: 2, xxs: 1 }}
          rowHeight={100}
          width={contentWidth}
          layouts={{}}
        >
          {pokeList}
          {/* {listPokemon.map(pokemon => (
            <PokeChar
              key={pokemon.name}
              onPokemonSelect={_this.props.onPokemonSelect}
              pokemon={pokemon}
            />
          ))} */}
        </ResponsiveGridLayout>
      </div>
    );
  }
}

export default PokeList;
