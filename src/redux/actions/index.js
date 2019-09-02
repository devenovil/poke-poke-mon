export function setSelectedPokemon(payload) {
  return {
    type: "SELECTED_POKEMON",
    pokemon: {
      name: payload.name,
      url: payload.url
    }
  };
}

export function setSelectedEmpty() {
  return {
    type: "SELECTED_EMPTY",
    pokemon: {}
  };
}

export function updateOwnedPokemon(payload) {
  return {
    type: "UPDATE_OWNED_POKEMON",
    owned_pokemon: {
      list: payload.list,
      listName: payload.listName
      //   name: payload.name,
      //   size: payload.size,
      //   nickname: payload.nickname
    }
    // owned_pokemon: {
    //   [payload.name]: {
    //     size: payload.size
    //   },
    //   list: [
    //     {
    //       name: payload.name,
    //       nickname: payload.nickname
    //     }
    //   ]
    // }
  };
}
