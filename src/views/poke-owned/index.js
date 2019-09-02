import React, { Component } from "react";
import { safeDeepGetWithType, safeDeepGet } from "../../lib/json";
import { isFunction, isEmptyObject } from "../../lib/object";

import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import store from "../../redux/store";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";
import { beautifyName } from "../../lib/formatter";

/* Sagas Action */
import { actions as notificationActions } from "../../redux/ducks/notification";
import { updateOwnedPokemon } from "../../redux/actions";

/* Redux */
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const ResponsiveGridLayout = WidthProvider(Responsive);

class PokeOwned extends Component {
  constructor(props) {
    super(props);
    let storeValue = store.getState();
    let listName = safeDeepGetWithType(
      storeValue,
      ["owned_pokemon", "listName"],
      {}
    );

    let pokemons = safeDeepGetWithType(
      storeValue,
      ["owned_pokemon", "list"],
      {}
    );

    this.state = {
      pokeList: listName,
      pokemons
    };
    this.onPokemonSelect = this.onPokemonSelect.bind(this);
  }

  onPokemonSelect(pokemon) {
    let onPokemonOwnedSelect = safeDeepGet(this, [
      "props",
      "onPokemonOwnedSelect"
    ]);
    if (isFunction(onPokemonOwnedSelect)) {
      onPokemonOwnedSelect(pokemon);
    }
  }

  handleRelease = async () => {
    let storeValue = store.getState();

    let listPoke = safeDeepGetWithType(
      storeValue,
      ["owned_pokemon", "list"],
      {}
    );
    let listName = safeDeepGetWithType(
      storeValue,
      ["owned_pokemon", "listName"],
      {}
    );

    let pokeKeys = safeDeepGetWithType(this, ["state", "pokeKeys"], "");

    let pokemon = safeDeepGetWithType(listName, [pokeKeys], {});

    if (isEmptyObject(pokemon)) return;

    let pokeName = safeDeepGetWithType(pokemon, ["name"], "");
    let pokeNickname = safeDeepGetWithType(pokemon, ["nickname"], "");

    let size = safeDeepGetWithType(listPoke, [pokeName, "size"], 0);

    if (size > 1) {
      size -= 1;
      listPoke[pokeName].size = size;
    } else {
      delete listPoke[pokeName];
    }

    delete listName[pokeKeys];

    let payload = {};

    payload.list = listPoke;
    payload.listName = listName;

    this.props.showSingleNotification({
      message: "Release " + pokeNickname + " (" + pokeName + ")" + " success",
      position: "tr",
      level: "info"
    });

    let updatePokemonAction = updateOwnedPokemon(payload);
    store.dispatch(updatePokemonAction);
    this.handleCloseDialogRelease();
  };

  handleCloseDialogRelease = () => {
    this.setState({
      openDialogRelease: false,
      pokeKeys: "",
      pokemon: {}
    });
  };

  render() {
    let listPokemon = safeDeepGetWithType(this, ["state", "pokeList"], {});
    let pokemons = safeDeepGetWithType(this, ["state", "pokemons"], {});

    if (isEmptyObject(listPokemon)) {
      this.props.showSingleNotification({
        message: "Didn't have any pokémon now",
        position: "tr",
        level: "warning"
      });
      this.props._parent.setState({ showPokeOwned: false });
    }
    let contentWidth = safeDeepGetWithType(
      this,
      ["props", "contentWidth"],
      window.innerWidth
    );

    let _this = this;

    const MON_INDEX_KEY = 6;
    const SPRITE_STR =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

    // const SPRITE_STR = "https://img.pokemondb.net/artwork/";

    let pokeList = [];

    let w = 1;
    let h = 1;

    let counterX = 0;
    let counterY = 0;

    var colLimity = 1;
    if (contentWidth >= 450.01 && contentWidth <= 931.01) {
      colLimity = 0;
    }

    for (let keys in listPokemon) {
      let pokemon = listPokemon[keys];
      let url = safeDeepGetWithType(pokemons, [pokemon.name, "url"], "");
      let MON_NUM = url.split("/")[MON_INDEX_KEY];

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
          key={keys}
          className="card pokeList"
          data-grid={{ x, y, w, h, isResizable: false, isDraggable: false }}
        >
          <div
            className="row"
            style={{ margin: 0 }}
            onClick={() =>
              _this.setState({
                openDialogRelease: true,
                pokemon,
                pokeKeys: keys
              })
            }
          >
            <span className="image">
              <img alt={pokemon.name} src={SPRITE_STR + MON_NUM + ".png"} />
            </span>
            <span>
              <div className="centeringItemVertical" style={{ height: 50 }}>
                <span className="selectionName" style={{ fontSize: 24 }}>
                  {pokemon.nickname.charAt(0).toUpperCase() +
                    pokemon.nickname.slice(1)}
                </span>
              </div>
              <div className="centeringItemVertical" style={{ height: 50 }}>
                <span>
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </span>
              </div>
            </span>
          </div>
        </div>
      );
    }

    let pokeName = beautifyName(
      safeDeepGetWithType(this, ["state", "pokemon", "name"], "")
    );
    let pokeNickname = beautifyName(
      safeDeepGetWithType(this, ["state", "pokemon", "nickname"], "")
    );

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
        <Dialog
          open={this.state.openDialogRelease}
          // onClose={this.handleCloseDialogAdd}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Release Pokémon</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure to release "{pokeNickname}" ({pokeName}) ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialogRelease} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.handleRelease}
              variant="contained"
              color="primary"
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {};
};

const mapDispatchToProps = function(dispatch) {
  return {
    ...bindActionCreators(notificationActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PokeOwned);
