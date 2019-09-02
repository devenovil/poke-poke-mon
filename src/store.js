import { applyMiddleware, createStore } from "redux";

import createSagaMiddleware from "redux-saga";

import actions from "./redux/sagas";
import reducers from "./redux/ducks";

// const initialState = {};
// export const store = createStore(reducers, initialState);

const sagaMiddleware = createSagaMiddleware();
const middleware = applyMiddleware(sagaMiddleware);

const store = createStore(reducers, middleware);
sagaMiddleware.run(actions);

export default store;
