import { put, takeEvery } from "redux-saga/effects";
import { types as notificationTypes } from "../ducks/notification";
import Notifications from "react-notification-system-redux";
import { isTextEmpty } from "../../lib/text";
import { safeDeepGetWithType } from "../../lib/json";

const DEFAULT_UID = "0";

function* showSingleNotification(action) {
  const payload = action.payload;
  const position = safeDeepGetWithType(payload, ["position"], "br");
  const level = safeDeepGetWithType(payload, ["level"], "info");
  const message = safeDeepGetWithType(payload, ["message"]);

  const opts = {
    uid: DEFAULT_UID,
    position: position
  };
  if (!isTextEmpty(message)) {
    opts["message"] = message;
    if (level === "info") {
      yield put(Notifications.info(opts));
    } else if (level === "success") {
      yield put(Notifications.success(opts));
    } else if (level === "warning") {
      yield put(Notifications.warning(opts));
    } else if (level === "error") {
      yield put(Notifications.error(opts));
    }
  }
}

function* hideSingleNotification(action) {
  yield put();
}

const notificationSaga = [
  takeEvery(notificationTypes.NOTIFICATION_SINGLE_SHOW, showSingleNotification),
  takeEvery(notificationTypes.NOTIFICATION_SINGLE_HIDE, hideSingleNotification)
];

export default notificationSaga;
