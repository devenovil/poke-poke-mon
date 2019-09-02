import React, { Component } from "react";
import { safeDeepGetWithType } from "../../lib/json";
import pokeapi from "../../api/pokeapi";
import { isEmptyObject } from "../../lib/object";
import { beautifyName } from "../../lib/formatter";
import "./style.scss";
import PokeMoves from "./PokeMoves";
import PokeStats from "./PokeStats";
import store from "../../redux/store";

class PokeDetail extends Component {
  componentDidMount() {
    let storeValue = store.getState();
    let pokemon = safeDeepGetWithType(storeValue, ["pokemon", "name"], "");
    if (pokemon !== "") {
      this.getPokemonDetail(pokemon);
    }
  }

  getPokemonDetail = async pokemon => {
    const response = await pokeapi.get(`${pokemon}`);
    let data = safeDeepGetWithType(response, ["data"], {});
    if (!isEmptyObject(data)) {
      this.setState({ pokemon: data });
    }
  };

  render() {
    let pokemon = safeDeepGetWithType(this, ["state", "pokemon"], {});

    if (isEmptyObject(pokemon)) {
      return <div style={{ margin: 20, color: "#f00" }}>Connection Error</div>;
    } else {
      // const SPRITE_STR =
      //     "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
      const SPRITE_STR = "https://img.pokemondb.net/artwork/";
      return (
        <div
          style={{
            padding: 20,
            background: "linear-gradient(to right bottom, #3a5ca8, #ffcb05)"
          }}
        >
          {/* <div className="">
                        <h2>Pokémon Information</h2>
                    </div> */}
          {/* <Card style={{ background: 'linear-gradient(to right bottom, #3a5ca8, #ffcb05)' }}>
                        <CardContent> */}
          <div
            className="centeringItem"
            style={{ minHeight: 200, minWidth: "100%" }}
          >
            <img
              className="pokepoke-detail-img"
              alt={pokemon.name}
              src={SPRITE_STR + pokemon.name + ".jpg"}
            />
          </div>
          <div>
            <h2 style={{ color: "#fff" }}>
              {pokemon.id}. {beautifyName(pokemon.name)}
              <div>
                {pokemon.types &&
                  pokemon.types.map(({ type }) => (
                    <span key={type.name} className={"type-label " + type.name}>
                      {type.name}
                    </span>
                  ))}
              </div>
            </h2>
          </div>
          {pokemon.stats && (
            <PokeStats
              stats={pokemon.stats}
              displaySprite={pokemon.displaySprite}
            />
          )}

          {pokemon.moves && <PokeMoves moves={pokemon.moves} />}
        </div>
      );
    }
  }
}

export default PokeDetail;
