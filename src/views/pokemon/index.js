import React, { Component } from "react";
import Loader from "react-loader-advanced";
// import Loader from 'react-loader-spinner'
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
// import ReactLoading from "react-loading";
import "./style.scss";
import PokeList from "../poke-list";
import pokeapiList from "../../api/pokeapiList";
import { SizeMe } from "react-sizeme";
import { safeDeepGetWithType } from "../../lib/json";
import { isEmptyObject } from "../../lib/object";
import {
  Button,
  AppBar,
  Typography,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions
} from "@material-ui/core";
import PokeDetail from "../poke-detail";
import {
  setSelectedPokemon,
  updateOwnedPokemon,
  setSelectedEmpty
} from "../../redux/actions";
import { customConfirmAlert } from "../../lib/react/react-confirm-alert";
import { beautifyName } from "../../lib/formatter";

/* Redux */
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

/* Sagas Action */
import { actions as notificationActions } from "../../redux/ducks/notification";
import store from "../../redux/store";
import PokeOwned from "../poke-owned";

// Unique Id
const uuidv1 = require("uuid/v1");

class Pokemon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPoke: null,
      searchedMon: null,
      listPokemon: [],
      selectedMons: []
    };
  }

  componentDidMount() {
    this.monsListGenerate();
  }

  monsListGenerate = async MON_LIMIT => {
    const monsListResponse = await pokeapiList.get("/pokemon", {
      params: {
        limit: 151 /* For first generation only */
      }
    });
    this.setState({ listPokemon: monsListResponse.data.results });
  };

  onPokemonSelect = async mon => {
    let selectedPokeAction = setSelectedPokemon({
      name: mon.name,
      url: mon.url
    });
    store.dispatch(selectedPokeAction);

    this.setState({ selectedPoke: mon.name, selectedPokeUrl: mon.url });
  };

  onCatchClicked = () => {
    this.setState({ loading: true });
    // TODO 50%
    let success = Math.random() < 0.5;
    setTimeout(() => this.afterCatchLoading(success), 2000);
  };

  handleChangeNickname = event => {
    this.setState({ pokeNickname: event.target.value });
  };

  handleCloseDialogAdd = () => {
    this.setState({
      openDialogAdd: false,
      pokeNickname: "",
      selectedPoke: ""
    });
  };

  checkSubmit = () => {
    let nickname = safeDeepGetWithType(this, ["state", "pokeNickname"], "");
    if (nickname === "") {
      this.props.showSingleNotification({
        message: "Nickname tidak boleh kosong",
        position: "tr",
        level: "error"
      });
    } else {
      this.handleSubmit(nickname);
    }
  };

  handleSubmit = async nickname => {
    let storeValue = store.getState();
    let selectedPoke = safeDeepGetWithType(this, ["state", "selectedPoke"], "");
    let selectedPokeUrl = safeDeepGetWithType(
      this,
      ["state", "selectedPokeUrl"],
      ""
    );
    // let selectedPokeUrl = safeDeepGetWithType(this, ["state", "selectedPoke"], "");
    if (selectedPoke === "") return;
    let payload = {};

    let newPoke = {};
    let newPokeName = {};

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

    let size = safeDeepGetWithType(listPoke, [selectedPoke, "size"], 0);

    size += 1;

    newPoke.name = selectedPoke;
    newPoke.url = selectedPokeUrl;
    newPoke.size = size;

    newPokeName.name = selectedPoke;
    newPokeName.nickname = nickname;

    const uniqId = uuidv1();

    listPoke[selectedPoke] = newPoke;
    listName[uniqId] = newPokeName;

    payload.list = listPoke;
    payload.listName = listName;

    let updatePokemonAction = updateOwnedPokemon(payload);
    let setEmptyAction = setSelectedEmpty();
    store.dispatch(updatePokemonAction);
    store.dispatch(setEmptyAction);

    this.props.showSingleNotification({
      message: "Catching " + nickname + " (" + selectedPoke + ")" + " success",
      position: "tr",
      level: "info"
    });
    this.handleCloseDialogAdd();
  };

  afterCatchLoading = isCatch => {
    let _this = this;

    if (isCatch) {
      this.setState({ openDialogAdd: true, loading: false });
    } else {
      this.setState({
        loading: false
      });
      let pokeName = beautifyName(
        safeDeepGetWithType(this, ["state", "selectedPoke"], "Pokémon")
      );
      customConfirmAlert(
        "Catch Failed",
        'Try to catch "' + pokeName + '" again?',
        "Try Again",
        _this.onCatchClicked,
        "Nope"
      );
    }
  };

  render() {
    let loading = safeDeepGetWithType(this, ["state", "loading"], false);

    let selectedPoke = safeDeepGetWithType(this, ["state", "selectedPoke"], "");
    let showPokeOwned = safeDeepGetWithType(
      this,
      ["state", "showPokeOwned"],
      false
    );

    let showPokeDetail = selectedPoke === "" ? false : true;
    // const spinner = (
    //   <div className="centeringItem">
    //     <ReactLoading type="cylon" color="#ff0000" />
    //   </div>
    // );
    let pokeName = beautifyName(
      safeDeepGetWithType(this, ["state", "selectedPoke"], "Pokémon")
    );

    let storeValue = store.getState();

    let ownedPokemon = safeDeepGetWithType(
      storeValue,
      ["owned_pokemon", "listName"],
      {}
    );

    let showOwnedButton = true;
    if (isEmptyObject(ownedPokemon)) {
      showPokeOwned = false;
      showOwnedButton = false;
    }

    return (
      <SizeMe>
        {({ size }) => (
          <Loader show={loading} /* message={spinner} */>
            <div>
              {/* <Loader
                type="Puff"
                color="#00BFFF"
                height="100"
                width="100"
              /> */}
              {showPokeDetail ? (
                <div>
                  <AppBar position="sticky" style={{ backgroundColor: "#fff" }}>
                    <Typography
                      style={{
                        flexGrow: 1,
                        textTransform: "capitalize",
                        padding: "5px 20px"
                      }}
                    >
                      <div className="row">
                        <div className="col-6">
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              this.setState({ selectedPoke: null })
                            }
                          >
                            Back
                          </Button>
                        </div>
                        <div className="col-6 button-right">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.onCatchClicked}
                          >
                            Catch
                          </Button>
                        </div>
                      </div>
                    </Typography>
                    {loading ? <LinearProgress color="secondary" /> : null}
                  </AppBar>
                  <PokeDetail />
                </div>
              ) : null}
              {showPokeOwned ? (
                <div>
                  <AppBar position="sticky" style={{ backgroundColor: "#fff" }}>
                    <Typography
                      style={{
                        flexGrow: 1,
                        textTransform: "capitalize",
                        padding: "5px 20px"
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => this.setState({ showPokeOwned: false })}
                      >
                        Back
                      </Button>
                    </Typography>
                    {loading ? <LinearProgress color="secondary" /> : null}
                  </AppBar>
                  <div
                    style={{
                      padding: 20,
                      background:
                        "linear-gradient(to right bottom,  #ffcb05, #3a5ca8)"
                    }}
                  >
                    <h1 className="selection">My Pokémon</h1>
                    <PokeOwned _parent={this} contentWidth={size.width} />
                  </div>
                </div>
              ) : null}
              {!showPokeOwned && !showPokeDetail ? (
                <div>
                  <AppBar
                    position="sticky"
                    style={{ backgroundColor: "#3B5CA8" }}
                  >
                    <Typography
                      style={{
                        flexGrow: 1,
                        textTransform: "capitalize",
                        padding: "20px 20px"
                      }}
                    >
                      <div className="row ">
                        <div className="col-6 centeringItemVertical">
                          Pokémon List
                        </div>
                        {showOwnedButton ? (
                          <div className="col-6 button-right">
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() =>
                                this.setState({ showPokeOwned: true })
                              }
                            >
                              My Pokémon
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </Typography>
                  </AppBar>
                  <div
                    style={{
                      padding: 20,
                      background:
                        "linear-gradient(to right bottom,  #ffcb05, #3a5ca8)"
                    }}
                  >
                    {/* <h1 className="selection">Pokémon List</h1> */}
                    <PokeList
                      onPokemonSelect={this.onPokemonSelect}
                      listPokemon={this.state.listPokemon}
                      contentWidth={size.width}
                    />
                  </div>
                </div>
              ) : null}
              <Dialog
                open={this.state.openDialogAdd}
                onClose={this.handleCloseDialogAdd}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Catch Success</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter nickname for your new {pokeName}.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="nickname"
                    label="Nickname"
                    fullWidth
                    onChange={this.handleChangeNickname}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseDialogAdd} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={this.checkSubmit}
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
              ;
            </div>
          </Loader>
        )}
      </SizeMe>
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
)(Pokemon);
