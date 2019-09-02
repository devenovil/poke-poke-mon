import notification from "./notification";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([...notification]);
}
