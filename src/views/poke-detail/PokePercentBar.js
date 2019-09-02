import React, { Component } from "react";
import { beautifyName } from "../../lib/formatter";
import { safeDeepGetWithType } from "../../lib/json";

class PokePercentBar extends Component {
  render() {
    let min = safeDeepGetWithType(this, ["props", "min"], "");
    let max = safeDeepGetWithType(this, ["props", "max"], "");
    let value = safeDeepGetWithType(this, ["props", "value"], 0);
    let title = safeDeepGetWithType(this, ["props", "title"], "");
    return (
      <div className={"pokepoke-percent-bar " + title}>
        <span className="percent-bar-title">{beautifyName(title)}</span>
        <div className="percent-bar">
          <div
            className="percent-bar-filler"
            style={{
              width:
                Math.min(
                  (value / (parseInt(max) - parseInt(min))) * 100,
                  100
                ).toString() + "%"
            }}
          ></div>
        </div>
        <span className="percent-bar-value">{value}</span>
      </div>
    );
  }
}

export default PokePercentBar;
