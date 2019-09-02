import React, { Component } from "react";
import { safeDeepGetWithType } from "../../lib/json";
import PokePercentBar from "./PokePercentBar";

class PokeStats extends Component {
  render() {
    let stats = safeDeepGetWithType(this, ["props", "stats"], []);
    return (
      <div className="pokepoke-stats pokepoke-popup-block">
        <div>
          <div className="pokepoke-stats-wrapper">
            {stats.map(({ stat, base_stat }) => (
              <PokePercentBar
                key={stat.name}
                min="0"
                max="300"
                value={base_stat}
                title={stat.name}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default PokeStats;
