import React, { Component } from "react";
import { beautifyName } from "../../lib/formatter";
import { safeDeepGetWithType } from "../../lib/json";

class PokeMoves extends Component {
  render() {
    let moves = safeDeepGetWithType(this, ["props", "moves"], []);
    return (
      <div className="pokepoke-moves pokepoke-popup-block">
        <p className="pokepoke-popup-block-header">Available Moves</p>
        <div className="pokepoke-moves-container">
          {moves.map(({ move }) => (
            <div key={move.name} className="pokepoke-moves-item">
              <span>{beautifyName(move.name)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default PokeMoves;
