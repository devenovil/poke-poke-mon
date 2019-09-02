export default (state, action) => {
  switch (action.type) {
    case "SELECTED_POKEMON":
      // do something
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          name: action.pokemon.name
        }
      };
    case "SELECTED_EMPTY":
      // do something
      return {
        ...state,
        pokemon: {}
      };
    case "UPDATE_OWNED_POKEMON":
      // do something
      return {
        ...state,
        owned_pokemon: {
          ...state.owned_pokemon,
          list: action.owned_pokemon.list,
          listName: action.owned_pokemon.listName
          // name: action.owned_pokemon.name,
          // nickname: action.owned_pokemon.nickname,
          // size: action.owned_pokemon.size

          //   [_pokeName]: {
          //     ...state.owned_pokemon[action.name],
          //     name: action.owned_pokemon.name,
          //     nickname: action.owned_pokemon.nickname,
          //     size: action.owned_pokemon.size
          //   }
          //   list: [
          //     ...state.owned_pokemon.list,
          //     {
          //       name: action.owned_pokemon.name,
          //       nickname: action.owned_pokemon.nickname,
          //       size: action.owned_pokemon.size
          //     }
          //   ]
        }
        // owned_pokemon: {
        //   ...state.owned_pokemon,
        //   [action.name]: {
        //     ...state.owned_pokemon[action.name],
        //     size: action.size
        //   },
        //   list: [
        //     ...state.owned_pokemon.list,
        //     {
        //       name: action.name,
        //       nickname: action.nickname
        //     }
        //   ]
        // }
      };
    default:
      // do something
      return state;
  }
};
